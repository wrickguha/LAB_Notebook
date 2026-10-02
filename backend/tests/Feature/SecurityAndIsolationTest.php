<?php

namespace Tests\Feature;

use App\Models\CalendarEvent;
use App\Models\AuditLog;
use App\Models\NotebookEntry;
use App\Models\Project;
use App\Models\Quote;
use App\Models\ResearchProjectAccess;
use App\Models\ResearchPaper;
use App\Models\SharedResource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityAndIsolationTest extends TestCase
{
    public function test_user_a_cannot_access_or_modify_user_b_project(): void
    {
        $userA = User::create([
            'name'     => 'User A',
            'email'    => 'user_a_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $userB = User::create([
            'name'     => 'User B',
            'email'    => 'user_b_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $projectB = Project::create([
            'user_id' => $userB->id,
            'name'    => 'Private Project B',
            'code'    => 'PRJ-B',
            'status'  => 'Active',
        ]);

        // User A attempts to view User B's project
        $response = $this->actingAs($userA)->getJson("/api/projects/{$projectB->id}");
        $response->assertStatus(403);

        // User A attempts to update User B's project
        $updateResponse = $this->actingAs($userA)->putJson("/api/projects/{$projectB->id}", [
            'name' => 'Hacked Project Name',
        ]);
        $updateResponse->assertStatus(403);

        // User A attempts to delete User B's project
        $deleteResponse = $this->actingAs($userA)->deleteJson("/api/projects/{$projectB->id}");
        $deleteResponse->assertStatus(403);

        $contentResponse = $this->postJson("/api/projects/{$projectB->id}/save-content", [
            'content' => '{"type":"doc","content":[]}',
        ]);
        $contentResponse->assertStatus(403);

        $this->assertDatabaseHas('projects', ['id' => $projectB->id, 'name' => 'Private Project B']);
    }

    public function test_calendar_events_are_strictly_user_isolated(): void
    {
        $userA = User::create([
            'name'     => 'User A',
            'email'    => 'user_a_cal_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $userB = User::create([
            'name'     => 'User B',
            'email'    => 'user_b_cal_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $eventB = CalendarEvent::create([
            'user_id'    => $userB->id,
            'title'      => 'User B Confidential Meeting',
            'start_date' => now()->toDateString(),
            'status'     => CalendarEvent::STATUS_SCHEDULED,
        ]);

        // User A attempts to view User B's calendar event
        $response = $this->actingAs($userA)->getJson("/api/calendar/events/{$eventB->id}");
        $response->assertStatus(403);

        // User A listing events does not include User B's event
        $listResponse = $this->actingAs($userA)->getJson('/api/calendar/events');
        $listResponse->assertStatus(200);
        $this->assertFalse(collect($listResponse->json())->contains('id', (string) $eventB->id));
    }

    public function test_file_upload_enforces_1mb_limit_and_file_types(): void
    {
        Storage::fake('public');

        $user = User::create([
            'name'     => 'Test Researcher',
            'email'    => 'researcher_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        // 1. Valid PDF upload (< 1MB)
        $validPdf = UploadedFile::fake()->create('protocol.pdf', 500, 'application/pdf');
        $response = $this->actingAs($user)->postJson('/api/files/upload', ['file' => $validPdf]);
        $response->assertStatus(201);

        // 2. Reject file exceeding 1MB (1025 KB)
        $oversizedFile = UploadedFile::fake()->create('large.pdf', 1025, 'application/pdf');
        $oversizedResponse = $this->actingAs($user)->postJson('/api/files/upload', ['file' => $oversizedFile]);
        $oversizedResponse->assertStatus(422);

        // 3. Reject executable (.php file)
        $maliciousFile = UploadedFile::fake()->create('shell.php', 10, 'text/x-php');
        $maliciousResponse = $this->actingAs($user)->postJson('/api/files/upload', ['file' => $maliciousFile]);
        $maliciousResponse->assertStatus(422);
    }

    public function test_daily_quote_is_user_authenticated_and_changes_by_date(): void
    {
        $user = User::create([
            'name'     => 'Quote Researcher',
            'email'    => 'quote_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->travelTo(now()->setDate(2026, 10, 2));
        $firstQuote = $this->actingAs($user)->getJson('/api/daily-quote')
            ->assertOk()
            ->json('id');

        $this->travelTo(now()->addDay());
        $secondQuote = $this->getJson('/api/daily-quote')
            ->assertOk()
            ->json('id');

        $this->assertNotSame($firstQuote, $secondQuote);
        $this->assertDatabaseCount('user_quote_selections', 2);
    }

    public function test_guest_cannot_read_or_write_daily_quote_selection(): void
    {
        $this->get('/api/csrf-cookie')->assertNoContent();

        Quote::query()->firstOrCreate(
            ['quote' => 'Test quote for guest access'],
            ['author' => 'Test author']
        );

        $this->getJson('/api/daily-quote')->assertUnauthorized();
        $this->postJson('/api/daily-quote/new')->assertUnauthorized();
        $this->assertDatabaseCount('user_quote_selections', 0);
    }

    public function test_research_records_and_dashboard_are_user_isolated(): void
    {
        $userA = User::create([
            'name'     => 'Records User A',
            'email'    => 'records_a_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);
        $userB = User::create([
            'name'     => 'Records User B',
            'email'    => 'records_b_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $resource = SharedResource::create([
            'user_id' => $userB->id,
            'name' => 'Private protocol',
            'owner' => $userB->name,
        ]);
        $paper = ResearchPaper::create([
            'user_id' => $userB->id,
            'title' => 'Private paper',
            'authors' => $userB->name,
            'doi' => '10.1000/private',
        ]);
        AuditLog::create([
            'user_id' => $userB->id,
            'user' => $userB->name,
            'action' => 'Private action',
            'target' => 'Private target',
        ]);

        $this->actingAs($userA)->getJson('/api/resources')->assertOk()->assertExactJson([]);
        $this->patchJson("/api/resources/{$resource->id}/permission", [
            'targetUser' => 'someone',
            'newLevel' => 'Editor',
        ])->assertForbidden();
        $this->getJson('/api/papers')->assertOk()->assertExactJson([]);
        $this->deleteJson("/api/papers/{$paper->id}")->assertForbidden();
        $this->getJson('/api/audit-logs')->assertOk()->assertExactJson([]);

        $summary = $this->getJson('/api/dashboard/summary')->assertOk();
        $this->assertSame(0, $summary->json('sharedNodes'));
        $this->assertSame(0, $summary->json('papers'));
        $this->assertSame([], $summary->json('auditLogs'));

        $this->postJson('/api/audit-logs', [
            'action' => 'Own action',
            'target' => 'Own target',
            'user' => $userB->name,
            'ip' => '192.0.2.5',
            'status' => 'Forged',
        ])->assertOk();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $userA->id,
            'user' => $userA->name,
            'action' => 'Own action',
            'status' => 'Verified',
        ]);
    }

    public function test_notebook_autosave_persists_tiptap_json_and_checks_access(): void
    {
        $owner = User::create([
            'name'     => 'Notebook Owner',
            'email'    => 'notebook_owner_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);
        $otherUser = User::create([
            'name'     => 'Notebook Visitor',
            'email'    => 'notebook_visitor_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);
        $folder = \App\Models\NotebookFolder::create([
            'user_id' => $owner->id,
            'name' => 'Protocols',
        ]);
        $otherFolder = \App\Models\NotebookFolder::create([
            'user_id' => $otherUser->id,
            'name' => 'Private folder',
        ]);
        $this->actingAs($owner)->postJson('/api/notebook/entries', [
            'folderId' => (string) $otherFolder->id,
            'title' => 'Unauthorized folder reference',
        ])->assertUnprocessable();

        $entry = NotebookEntry::create([
            'user_id' => $owner->id,
            'folder_id' => (string) $folder->id,
            'title' => 'Draft',
            'status' => 'Draft',
            'content' => '',
        ]);
        $document = '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Cell assay"}]}]}';

        $this->actingAs($owner)->postJson("/api/notebook/entries/{$entry->id}/auto-save", [
            'content_json' => $document,
            'content' => 'Cell assay',
            'title' => 'Assay notes',
        ])->assertOk();

        $this->assertDatabaseHas('notebook_entries', [
            'id' => $entry->id,
            'content_json' => $document,
            'content' => 'Cell assay',
            'title' => 'Assay notes',
        ]);

        $this->actingAs($otherUser)
            ->postJson("/api/notebook/entries/{$entry->id}/auto-save", [
                'content_json' => $document,
            ])
            ->assertForbidden();

        $signed = $this->actingAs($owner)
            ->postJson("/api/notebook/entries/{$entry->id}/sign")
            ->assertOk()
            ->assertJsonPath('status', 'Signed')
            ->assertJsonPath('signedByName', $owner->name)
            ->json();

        $this->assertNotNull($signed['signedAt']);
        $this->assertSame(64, strlen($signed['signatureHash']));
        $this->assertTrue($signed['signatureValid']);
        $this->assertDatabaseHas('notebook_entries', [
            'id' => $entry->id,
            'signed_by' => $owner->id,
            'signature_hash' => $signed['signatureHash'],
        ]);
        $this->actingAs($owner)
            ->postJson("/api/notebook/entries/{$entry->id}/auto-save", [
                'content_json' => '{"type":"doc","content":[]}',
            ])
            ->assertStatus(422);

        NotebookEntry::whereKey($entry->id)->update(['content' => 'Unexpected database edit']);
        $this->getJson("/api/notebook/entries/{$entry->id}")
            ->assertOk()
            ->assertJsonPath('signatureValid', false);
    }

    public function test_theme_preference_is_persisted_on_the_authenticated_user(): void
    {
        $user = User::create([
            'name' => 'Theme Researcher',
            'email' => 'theme_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->actingAs($user)
            ->putJson('/api/users/me', ['theme_preference' => 'dark'])
            ->assertOk()
            ->assertJsonPath('theme_preference', 'dark');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'theme_preference' => 'dark',
        ]);
    }

    public function test_shared_project_updates_notify_collaborators(): void
    {
        $owner = User::create([
            'name' => 'Project Owner',
            'email' => 'project_owner_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);
        $collaborator = User::create([
            'name' => 'Project Collaborator',
            'email' => 'project_collab_' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
        ]);
        $project = Project::create([
            'user_id' => $owner->id,
            'name' => 'Shared study',
            'code' => 'SHARED-01',
            'status' => 'Active',
        ]);
        ResearchProjectAccess::create([
            'project_id' => $project->id,
            'user_id' => $collaborator->id,
            'access_level' => ResearchProjectAccess::LEVEL_VIEW,
            'invited_by' => $owner->id,
        ]);

        $this->actingAs($owner)->putJson("/api/projects/{$project->id}", [
            'name' => 'Updated shared study',
        ])->assertOk();

        $this->actingAs($collaborator)
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('items.0.title', 'Research project updated')
            ->assertJsonPath('items.0.referenceId', (string) $project->id);
    }
}
