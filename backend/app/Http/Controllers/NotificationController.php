<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $notifications = Notification::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $unreadCount = Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'unreadCount' => $unreadCount,
            'items'       => $notifications->map(fn ($n) => [
                'id'            => (string) $n->id,
                'title'         => $n->title,
                'message'       => $n->message,
                'type'          => $n->type ?? 'system',
                'referenceId'   => $n->reference_id ? (string) $n->reference_id : null,
                'referenceType' => $n->reference_type,
                'read'          => ! is_null($n->read_at),
                'createdAt'     => $n->created_at?->toISOString(),
            ]),
        ]);
    }

    public function markRead()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function markOneRead(Notification $notification)
    {
        $userId = Auth::id();
        if (!$userId || $notification->user_id !== $userId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function destroy(Notification $notification)
    {
        $userId = Auth::id();
        if (!$userId || $notification->user_id !== $userId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification removed']);
    }
}
