<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\CalendarEvent;
use App\Models\NotebookEntry;
use App\Models\Notification;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ResearchPaper;
use App\Models\SharedResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function summary()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 1. Projects accessible by user
        $projects = Project::with(['milestones', 'accessList.user', 'user'])
            ->accessibleBy($userId)
            ->get();

        $activeProjects = $projects->where('status', '!=', 'Completed')->count();
        $completedProjects = $projects->where('status', 'Completed')->count();

        // 2. Notebook entries
        $notebookEntries = NotebookEntry::where('user_id', $userId)->get();
        $notebookLogsCount = $notebookEntries->count();
        $inReviewNotesCount = $notebookEntries->where('status', 'In Review')->count();
        $signedNotesCount = $notebookEntries->whereIn('status', ['Approved', 'Signed'])->count();

        // 3. Shared Resources & Papers
        $resources = SharedResource::where('user_id', $userId)->get();
        $papers = ResearchPaper::where('user_id', $userId)->get();

        // 4. Real Calendar Events (upcoming from today onwards)
        $today = now()->toDateString();
        $calendarEvents = CalendarEvent::where('user_id', $userId)
            ->where('start_date', '>=', $today)
            ->where('status', CalendarEvent::STATUS_SCHEDULED)
            ->with('project')
            ->orderBy('start_date')
            ->orderBy('start_time')
            ->take(5)
            ->get()
            ->map(fn ($ev) => [
                'id'        => (string) $ev->id,
                'date'      => $ev->start_date->isToday() ? 'Today' : ($ev->start_date->isTomorrow() ? 'Tomorrow' : $ev->start_date->format('M d')),
                'rawDate'   => $ev->start_date->format('Y-m-d'),
                'event'     => $ev->title,
                'time'      => $ev->start_time ? Carbon::parse($ev->start_time)->format('h:i A') : 'All Day',
                'lab'       => $ev->location ?: ($ev->project ? $ev->project->name : 'Laboratory Cluster'),
                'tag'       => $ev->event_type,
                'status'    => $ev->status,
            ]);

        // 5. Pending Tasks (Uncompleted milestones from user projects)
        $projectIds = $projects->pluck('id');
        $pendingMilestonesCount = ProjectMilestone::whereIn('project_id', $projectIds)
            ->where('completed', false)
            ->count();

        // 6. Unread Notifications
        $unreadNotificationsCount = Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();

        // 7. Real Weekly Activity Output (grouped by last 7 days)
        $weeklyOutput = [];
        for ($i = 6; $i >= 0; $i--) {
            $dayDate = now()->subDays($i);
            $dayName = $dayDate->format('D');
            $dateStr = $dayDate->toDateString();

            $entriesOnDay = $notebookEntries->filter(fn ($entry) =>
                ($entry->created_at && $entry->created_at->toDateString() === $dateStr)
                || $entry->date === $dateStr
            )->count();
            $projectsUpdatedOnDay = $projects->filter(fn ($project) =>
                $project->updated_at && $project->updated_at->toDateString() === $dateStr
            )->count();

            $weeklyOutput[] = [
                'day'          => $dayName,
                'Data Entries' => $entriesOnDay,
                'Projects Updated' => $projectsUpdatedOnDay,
            ];
        }

        // 8. Audit Logs
        $auditLogs = AuditLog::where('user_id', $userId)->latest()->take(10)->get();

        return response()->json([
            'activeProjects'           => $activeProjects,
            'completedProjects'        => $completedProjects,
            'notebookLogs'             => $notebookLogsCount,
            'inReviewNotes'            => $inReviewNotesCount,
            'signedNotes'              => $signedNotesCount,
            'sharedNodes'              => $resources->count(),
            'papers'                   => $papers->count(),
            'upcomingMeetings'         => $calendarEvents->count(),
            'pendingTasks'             => $pendingMilestonesCount,
            'unreadNotifications'      => $unreadNotificationsCount,
            'calendarItems'            => $calendarEvents,
            'weeklyProductivity'       => $weeklyOutput,
            'auditLogs' => $auditLogs->map(fn ($log) => [
                'id'        => (string) $log->id,
                'timestamp' => $log->timestamp,
                'user'      => $log->user,
                'action'    => $log->action,
                'target'    => $log->target,
                'ip'        => $log->ip,
                'status'    => $log->status,
            ]),
            'projects' => $projects->map(function ($project) use ($userId) {
                return [
                    'id'           => (string) $project->id,
                    'name'         => $project->name,
                    'code'         => $project->code,
                    'description'  => $project->description,
                    'status'       => $project->status,
                    'banner'       => $project->banner,
                    'progress'     => (int) ($project->progress ?? 0),
                    'lastActivity' => $project->last_activity?->toISOString() ?? $project->updated_at?->toISOString(),
                    'isOwner'      => $project->user_id === $userId,
                    'accessLevel'  => $project->user_id === $userId
                        ? 3
                        : (int) ($project->accessList->firstWhere('user_id', $userId)?->access_level ?? 0),
                    'members'      => $project->members ?? [],
                    'milestones'   => $project->milestones->map(fn ($m) => [
                        'id'        => (string) $m->id,
                        'name'      => $m->name,
                        'completed' => (bool) $m->completed,
                    ])->values()->all(),
                ];
            })->values()->all(),
        ]);
    }
}
