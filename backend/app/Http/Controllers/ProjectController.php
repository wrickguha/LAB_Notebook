<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMilestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('milestones')->orderByDesc('updated_at')->get()->map(function ($project) {
            return $this->serializeProject($project);
        });

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'code' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'banner' => ['nullable', 'string'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'milestones' => ['nullable', 'array'],
            'members' => ['nullable', 'array'],
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? '',
            'status' => $validated['status'] ?? 'Active',
            'banner' => $validated['banner'] ?? 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800',
            'progress' => $validated['progress'] ?? 0,
            'members' => $validated['members'] ?? [
                ['name' => 'Dr. Evelyn Thorne', 'role' => 'Principal Investigator', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'],
            ],
            'last_activity' => now(),
        ]);

        foreach ($validated['milestones'] ?? [] as $milestone) {
            $project->milestones()->create([
                'name' => $milestone['name'] ?? '',
                'completed' => (bool) ($milestone['completed'] ?? false),
            ]);
        }

        return response()->json($this->serializeProject($project->load('milestones')));
    }

    public function toggleMilestone(Project $project, ProjectMilestone $milestone)
    {
        if ($milestone->project_id !== $project->id) {
            return response()->json(['message' => 'Milestone not found for project'], 404);
        }

        $milestone->completed = ! $milestone->completed;
        $milestone->save();

        $project->refresh();
        $milestones = $project->milestones()->get();
        $completed = $milestones->where('completed', true)->count();
        $total = $milestones->count();
        $project->progress = $total > 0 ? (int) round(($completed / $total) * 100) : 0;
        $project->last_activity = now();
        $project->save();

        return response()->json($this->serializeProject($project->load('milestones')));
    }

    protected function serializeProject(Project $project): array
    {
        $milestones = $project->milestones()->get()->map(function ($item) {
            return [
                'id' => (string) $item->id,
                'name' => $item->name,
                'completed' => (bool) $item->completed,
            ];
        })->values()->all();

        return [
            'id' => (string) $project->id,
            'name' => $project->name,
            'code' => $project->code,
            'description' => $project->description,
            'status' => $project->status,
            'banner' => $project->banner,
            'progress' => (int) $project->progress,
            'lastActivity' => $project->last_activity?->toISOString(),
            'members' => $project->members ?? [
                ['name' => 'Dr. Evelyn Thorne', 'role' => 'Principal Investigator', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'],
            ],
            'milestones' => $milestones,
        ];
    }
}
