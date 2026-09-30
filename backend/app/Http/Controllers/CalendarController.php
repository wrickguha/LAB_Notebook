<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CalendarController extends Controller
{
    /**
     * List internal calendar events for authenticated user with optional range filtering.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $query = CalendarEvent::with('project')
            ->where('user_id', $userId);

        if ($request->filled('start_date')) {
            $query->where('start_date', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->where('start_date', '<=', $request->input('end_date'));
        }

        if ($request->filled('status')) {
            $query->where('status', (int) $request->input('status'));
        }

        $events = $query->orderBy('start_date')
            ->orderBy('start_time')
            ->get()
            ->map(fn ($e) => $this->serializeEvent($e));

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date'  => ['required', 'date'],
            'start_time'  => ['nullable', 'date_format:H:i,H:i:s'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
            'end_time'    => ['nullable', 'date_format:H:i,H:i:s'],
            'event_type'  => ['nullable', 'string', 'max:50'],
            'status'      => ['nullable', 'integer', 'in:1,2,3'],
            'location'    => ['nullable', 'string', 'max:255'],
            'project_id'  => ['nullable', 'exists:projects,id'],
            'is_all_day'  => ['nullable', 'boolean'],
        ]);

        $event = CalendarEvent::create([
            'user_id'     => $userId,
            'project_id'  => $validated['project_id'] ?? null,
            'title'       => trim($validated['title']),
            'description' => $validated['description'] ?? null,
            'start_date'  => $validated['start_date'],
            'start_time'  => $validated['start_time'] ?? null,
            'end_date'    => $validated['end_date'] ?? $validated['start_date'],
            'end_time'    => $validated['end_time'] ?? null,
            'event_type'  => $validated['event_type'] ?? 'Meeting',
            'status'      => $validated['status'] ?? CalendarEvent::STATUS_SCHEDULED,
            'location'    => $validated['location'] ?? null,
            'is_all_day'  => (bool) ($validated['is_all_day'] ?? false),
        ]);

        // In-app notification
        NotificationService::send(
            $userId,
            'Event Scheduled',
            "\"{$event->title}\" scheduled for " . $event->start_date->format('M d, Y'),
            'calendar',
            $event->id,
            'calendar_event'
        );

        return response()->json($this->serializeEvent($event), 201);
    }

    public function show(CalendarEvent $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($this->serializeEvent($event));
    }

    public function update(Request $request, CalendarEvent $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date'  => ['sometimes', 'required', 'date'],
            'start_time'  => ['nullable', 'date_format:H:i,H:i:s'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
            'end_time'    => ['nullable', 'date_format:H:i,H:i:s'],
            'event_type'  => ['nullable', 'string', 'max:50'],
            'status'      => ['nullable', 'integer', 'in:1,2,3'],
            'location'    => ['nullable', 'string', 'max:255'],
            'project_id'  => ['nullable', 'exists:projects,id'],
            'is_all_day'  => ['nullable', 'boolean'],
        ]);

        $event->fill($validated);
        $event->save();

        return response()->json($this->serializeEvent($event));
    }

    public function destroy(CalendarEvent $event)
    {
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Calendar event deleted successfully']);
    }

    protected function serializeEvent(CalendarEvent $event): array
    {
        return [
            'id'          => (string) $event->id,
            'title'       => $event->title,
            'description' => $event->description,
            'startDate'   => $event->start_date ? $event->start_date->format('Y-m-d') : null,
            'startTime'   => $event->start_time ? substr((string) $event->start_time, 0, 5) : null,
            'endDate'     => $event->end_date ? $event->end_date->format('Y-m-d') : null,
            'endTime'     => $event->end_time ? substr((string) $event->end_time, 0, 5) : null,
            'eventType'   => $event->event_type,
            'status'      => (int) $event->status,
            'location'    => $event->location,
            'isAllDay'    => (bool) $event->is_all_day,
            'projectId'   => $event->project_id ? (string) $event->project_id : null,
            'projectName' => $event->project?->name,
            'createdAt'   => $event->created_at?->toISOString(),
        ];
    }
}
