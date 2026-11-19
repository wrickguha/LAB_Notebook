<?php

namespace Tests\Feature;

use App\Models\FileRecord;
use App\Models\Project;
use App\Models\ResearchProjectAccess;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectSectionTest extends TestCase
{
    public function test_project_experiments_persist_and_enforce_project_permissions(): void
    {
        $owner = $this->createUser('experiment-owner');
        $viewer = $this->createUser('experiment-viewer');
        $project = $this->createProject($owner);
        ResearchProjectAccess::create([
            'project_id' => $project->id,
            'user_id' => $viewer->id,
            'access_level' => ResearchProjectAccess::LEVEL_VIEW,
        ]);

        $created = $this->actingAs($owner)->postJson("/api/projects/{$project->id}/experiments", [
            'name' => 'Cell viability assay',
            'notes' => 'Baseline treatment group',
            'date' => '2026-11-19',
        ])->assertCreated()
            ->assertJsonPath('expId', 'EXP-001')
            ->assertJsonPath('completed', false);

        $experimentId = $created->json('id');
        $this->actingAs($owner)->postJson("/api/projects/{$project->id}/experiments", [
            'name' => 'Dose response',
        ])->assertCreated()->assertJsonPath('expId', 'EXP-002');

        $this->actingAs($viewer)
            ->getJson("/api/projects/{$project->id}/experiments")
            ->assertOk()
            ->assertJsonCount(2);

        $this->patchJson("/api/projects/{$project->id}/experiments/{$experimentId}", [
            'completed' => true,
        ])->assertForbidden();

        $this->actingAs($owner)->patchJson("/api/projects/{$project->id}/experiments/{$experimentId}", [
            'completed' => true,
        ])->assertOk()->assertJsonPath('completed', true);

        $this->actingAs($owner)->deleteJson("/api/projects/{$project->id}/experiments/{$experimentId}")
            ->assertOk();
        $this->assertDatabaseMissing('project_experiments', ['id' => $experimentId]);
    }

    public function test_project_files_are_private_and_restricted_to_project_access(): void
    {
        Storage::fake('local');
        Storage::fake('public');

        $owner = $this->createUser('file-owner');
        $viewer = $this->createUser('file-viewer');
        $outsider = $this->createUser('file-outsider');
        $project = $this->createProject($owner);
        ResearchProjectAccess::create([
            'project_id' => $project->id,
            'user_id' => $viewer->id,
            'access_level' => ResearchProjectAccess::LEVEL_VIEW,
        ]);

        $upload = $this->actingAs($owner)->postJson("/api/projects/{$project->id}/files", [
            'file' => UploadedFile::fake()->create('protocol.pdf', 400, 'application/pdf'),
        ])->assertCreated();

        $fileId = $upload->json('id');
        $downloadUrl = $upload->json('url');
        $this->assertStringContainsString("/api/projects/{$project->id}/files/{$fileId}/download", $downloadUrl);
        $this->assertDatabaseHas('files', [
            'id' => $fileId,
            'project_id' => $project->id,
            'storage_disk' => 'local',
        ]);

        $this->actingAs($viewer)->getJson("/api/projects/{$project->id}/files")
            ->assertOk()
            ->assertJsonCount(1);
        $this->get($downloadUrl)->assertOk();

        $this->actingAs($viewer)->postJson("/api/projects/{$project->id}/files", [
            'file' => UploadedFile::fake()->create('other.pdf', 100, 'application/pdf'),
        ])->assertForbidden();
        $this->deleteJson("/api/projects/{$project->id}/files/{$fileId}")->assertForbidden();

        $this->actingAs($outsider)->getJson("/api/projects/{$project->id}/files")->assertForbidden();
        $this->postJson('/api/files/upload', [
            'project_id' => $project->id,
            'file' => UploadedFile::fake()->create('outside.pdf', 100, 'application/pdf'),
        ])->assertForbidden();
        $this->assertDatabaseHas('files', ['id' => $fileId]);

        $storedPath = FileRecord::findOrFail($fileId)->path;
        $this->actingAs($owner)->deleteJson("/api/projects/{$project->id}/files/{$fileId}")
            ->assertOk();
        Storage::disk('local')->assertMissing($storedPath);
    }

    public function test_project_banner_upload_requires_edit_access_and_valid_image(): void
    {
        Storage::fake('public');

        $owner = $this->createUser('banner-owner');
        $viewer = $this->createUser('banner-viewer');
        $project = $this->createProject($owner);
        ResearchProjectAccess::create([
            'project_id' => $project->id,
            'user_id' => $viewer->id,
            'access_level' => ResearchProjectAccess::LEVEL_VIEW,
        ]);

        $image = $this->fakePng('cover.png');
        $response = $this->actingAs($owner)->post("/api/projects/{$project->id}/banner", [
            'image' => $image,
        ])->assertOk();

        $this->assertStringContainsString('/storage/project-banners/', $response->json('banner'));
        $this->actingAs($viewer)->post("/api/projects/{$project->id}/banner", [
            'image' => $this->fakePng('blocked.png'),
        ])->assertForbidden();

        $this->actingAs($owner)->post("/api/projects/{$project->id}/banner", [
            'image' => UploadedFile::fake()->create('not-an-image.pdf', 10, 'application/pdf'),
        ])->assertUnprocessable();
    }

    public function test_project_team_sharing_persists_and_can_be_revoked(): void
    {
        $owner = $this->createUser('team-owner');
        $member = $this->createUser('team-member');
        $project = $this->createProject($owner);

        $this->actingAs($owner)->postJson("/api/projects/{$project->id}/share", [
            'email' => $member->email,
            'access_level' => ResearchProjectAccess::LEVEL_EDIT,
        ])->assertOk()
            ->assertJsonPath('access.userId', (string) $member->id)
            ->assertJsonPath('access.accessLevel', ResearchProjectAccess::LEVEL_EDIT);

        $this->getJson("/api/projects/{$project->id}")
            ->assertOk()
            ->assertJsonPath('collaborators.0.userId', (string) $member->id);

        $this->deleteJson("/api/projects/{$project->id}/share/{$member->id}")
            ->assertOk();
        $this->assertDatabaseMissing('research_project_access', [
            'project_id' => $project->id,
            'user_id' => $member->id,
        ]);
    }

    private function createUser(string $prefix): User
    {
        return User::create([
            'name' => ucfirst($prefix),
            'email' => $prefix.'_'.uniqid().'@example.com',
            'password' => bcrypt('password123'),
        ]);
    }

    private function createProject(User $owner): Project
    {
        return Project::create([
            'user_id' => $owner->id,
            'name' => 'Research project',
            'code' => strtoupper(substr(uniqid(), -8)),
            'status' => 'Planning',
        ]);
    }

    private function fakePng(string $name): UploadedFile
    {
        $contents = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jDYAAAAAASUVORK5CYII=',
            true
        );

        return UploadedFile::fake()->createWithContent($name, $contents);
    }
}
