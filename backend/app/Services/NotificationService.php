<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Send an in-app notification to a user.
     */
    public static function send(
        int $userId,
        string $title,
        string $message,
        string $type = 'system',
        ?int $referenceId = null,
        ?string $referenceType = null
    ): Notification {
        return Notification::create([
            'user_id'        => $userId,
            'title'          => $title,
            'message'        => $message,
            'type'           => $type,
            'reference_id'   => $referenceId,
            'reference_type' => $referenceType,
            'read_at'        => null,
        ]);
    }
}
