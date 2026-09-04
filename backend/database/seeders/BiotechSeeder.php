<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\NotebookEntry;
use App\Models\NotebookFolder;
use App\Models\Notification;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ResearchPaper;
use App\Models\SharedResource;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BiotechSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->delete();

        $user = User::create([
            'name' => 'Dr. Evelyn Thorne',
            'email' => 'evelyn.thorne@inveniqlab.ai',
            'password' => Hash::make('password123'),
            'role' => 'Principal Investigator',
            'institution' => 'Institute of Biomolecular Sciences',
            'lab' => 'Thorne Genomics Lab',
            'avatar' => null,
        ]);

        $project1 = Project::create([
            'name' => 'CRISPR Genome Editing',
            'code' => 'CRISPR-01',
            'description' => 'Targeted gene editing workflow for adaptive therapy models.',
            'status' => 'Active',
            'banner' => 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800',
            'progress' => 72,
            'members' => [
                ['name' => 'Dr. Evelyn Thorne', 'role' => 'Principal Investigator', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'],
                ['name' => 'Sarah Kim', 'role' => 'Scientist', 'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'],
                ['name' => 'Nadia Russo', 'role' => 'Analyst', 'avatar' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'],
            ],
            'last_activity' => now(),
        ]);

        $project1->milestones()->createMany([
            ['name' => 'Vector design review', 'completed' => true],
            ['name' => 'Cell transfection calibration', 'completed' => true],
            ['name' => 'Sequencing validation', 'completed' => false],
            ['name' => 'Data package sign-off', 'completed' => false],
        ]);

        $project2 = Project::create([
            'name' => 'Polymer Scaffold Trials',
            'code' => 'POLY-09',
            'description' => 'Biopolymer matrix trials for regenerative support structures.',
            'status' => 'Planning',
            'banner' => 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800',
            'progress' => 35,
            'members' => [
                ['name' => 'Dr. Evelyn Thorne', 'role' => 'Principal Investigator', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'],
                ['name' => 'Omar Diaz', 'role' => 'Engineer', 'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'],
            ],
            'last_activity' => now()->subDays(1),
        ]);

        $project2->milestones()->createMany([
            ['name' => 'Material screening', 'completed' => true],
            ['name' => 'Stress profile mapping', 'completed' => false],
            ['name' => 'Pilot fabrication', 'completed' => false],
        ]);

        $folder1 = NotebookFolder::create(['name' => 'Genomics Logs']);
        $folder2 = NotebookFolder::create(['name' => 'Materials Notebook']);

        NotebookEntry::create([
            'folder_id' => $folder1->id,
            'project_id' => $project1->id,
            'title' => 'Transfection efficiency calibration',
            'status' => 'Approved',
            'content' => "### Objective\nAssess transfection efficiency across 3 cell lines.\n\n### Procedure\n1. Prepare DNA mix\n2. Normalize reagent volumes\n3. Capture live readouts",
            'author' => 'Dr. Evelyn Thorne',
            'date' => now()->toDateString(),
        ]);

        NotebookEntry::create([
            'folder_id' => $folder2->id,
            'project_id' => $project2->id,
            'title' => 'Hydrogel compression trial',
            'status' => 'Draft',
            'content' => "### Objective\nCompare compression resistance across polymer batches.\n\n### Procedure\n1. Load test specimen\n2. Record stress values\n3. Export summary",
            'author' => 'Sarah Kim',
            'date' => now()->subDay()->toDateString(),
        ]);

        SharedResource::create([
            'name' => 'CRISPR Vector Library',
            'type' => 'Folder',
            'owner' => 'Dr. Evelyn Thorne',
            'shared_with' => ['Sarah Kim (Editor)', 'Nadia Russo (Viewer)'],
            'last_modified' => now()->toDateString(),
        ]);

        SharedResource::create([
            'name' => 'Hydrogel Stability Sheet',
            'type' => 'File',
            'owner' => 'Dr. Evelyn Thorne',
            'shared_with' => ['Omar Diaz (Commenter)'],
            'last_modified' => now()->subDays(2)->toDateString(),
        ]);

        ResearchPaper::create([
            'title' => 'CRISPR-Based Gene Editing in Mammalian Systems',
            'authors' => 'Zhang F., Hubbell J.',
            'journal' => 'Nature Biotechnology',
            'year' => 2025,
            'doi' => '10.1038/nbt.2025.101',
            'summary' => 'Comparative review of editing efficiency and validation in mammalian cell systems.',
            'tags' => ['CRISPR', 'Gene Editing', 'Validation'],
        ]);

        ResearchPaper::create([
            'title' => 'Biopolymer Scaffolds for Tissue Repair',
            'authors' => 'Miller A., Patel D.',
            'journal' => 'Advanced Materials',
            'year' => 2024,
            'doi' => '10.1002/adma.2024.880',
            'summary' => 'Explores polymer microstructure and scaffold resilience in regenerative models.',
            'tags' => ['Biomaterials', 'Scaffolds', 'Regeneration'],
        ]);

        AuditLog::create([
            'user' => 'Dr. Evelyn Thorne',
            'action' => 'Signed notebook entry',
            'target' => 'Transfection efficiency calibration',
            'ip' => '10.0.0.12',
            'status' => 'Verified',
            'timestamp' => now()->subHours(2)->toDateTimeString(),
        ]);

        AuditLog::create([
            'user' => 'Sarah Kim',
            'action' => 'Updated project milestone',
            'target' => 'CRISPR-01',
            'ip' => '10.0.0.18',
            'status' => 'Verified',
            'timestamp' => now()->subHours(5)->toDateTimeString(),
        ]);

        Notification::create([
            'user_id' => $user->id,
            'title' => 'Notebook approved',
            'message' => 'Transfection efficiency calibration was signed and locked.',
            'read_at' => null,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'title' => 'Milestone updated',
            'message' => 'CRISPR Genome Editing progress was updated to 72%.',
            'read_at' => now(),
        ]);
    }
}
