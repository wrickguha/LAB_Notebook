<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\NotebookEntry;
use App\Models\Project;
use App\Models\SharedResource;
use App\Models\ResearchPaper;

class DashboardController extends Controller
{
    public function summary()
    {
        $projects = Project::with('milestones')->get();
        $entries = NotebookEntry::all();
        $resources = SharedResource::all();
        $papers = ResearchPaper::all();
        $auditLogs = AuditLog::latest()->take(10)->get();

        return response()->json([
            'activeProjects' => $projects->count(),
            'completedProjects' => $projects->where('status', 'Completed')->count(),
            'notebookLogs' => $entries->count(),
            'sharedNodes' => $resources->count(),
            'papers' => $papers->count(),
            'auditLogs' => $auditLogs->map(fn ($log) => [
                'id' => (string) $log->id,
                'timestamp' => $log->timestamp,
                'user' => $log->user,
                'action' => $log->action,
                'target' => $log->target,
                'ip' => $log->ip,
                'status' => $log->status,
            ]),
            'projects' => $projects->map(function ($project) {
                return [
                    'id' => (string) $project->id,
                    'name' => $project->name,
                    'code' => $project->code,
                    'description' => $project->description,
                    'status' => $project->status,
                    'banner' => $project->banner,
                    'progress' => (int) ($project->progress ?? 0),
                    'lastActivity' => $project->last_activity?->toISOString(),
                    'members' => $project->members ?? [],
                    'milestones' => $project->milestones->map(fn ($milestone) => [
                        'id' => (string) $milestone->id,
                        'name' => $milestone->name,
                        'completed' => (bool) $milestone->completed,
                    ])->values()->all(),
                ];
            })->values()->all(),
        ]);
    }
}
