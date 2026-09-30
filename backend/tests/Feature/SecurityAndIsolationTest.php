<?php

namespace Tests\Feature;

use App\Models\CalendarEvent;
use App\Models\NotebookEntry;
use App\Models\Project;
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
}
