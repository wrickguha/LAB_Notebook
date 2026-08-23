<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $notifications = Notification::query()
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications->map(fn ($notification) => [
            'id' => (string) $notification->id,
            'title' => $notification->title,
            'message' => $notification->message,
            'read' => ! is_null($notification->read_at),
            'createdAt' => $notification->created_at?->toISOString(),
        ]));
    }

    public function markRead()
    {
        $userId = Auth::id();

        Notification::query()
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notifications marked as read']);
    }
}
