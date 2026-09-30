<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $fillable = [
        'user_id',
        'name',
        'code',
        'description',
        'content',
        'status',
        'banner',
        'progress',
        'last_activity',
        'members',
    ];

    protected $casts = [
        'members'       => 'array',
        'last_activity' => 'datetime',
        'progress'      => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function accessList(): HasMany
    {
        return $this->hasMany(ResearchProjectAccess::class, 'project_id');
    }

    public function calendarEvents(): HasMany
    {
        return $this->hasMany(CalendarEvent::class, 'project_id');
    }

    public function notebookEntries(): HasMany
    {
        return $this->hasMany(NotebookEntry::class, 'project_id');
    }

    /**
     * Scope to projects owned by user OR shared with user.
     */
    public function scopeAccessibleBy(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId)
            ->orWhereHas('accessList', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });
    }

    public function getUserAccessLevel(int $userId): int
    {
        if ($this->user_id === $userId) {
            return ResearchProjectAccess::LEVEL_ADMIN;
        }

        $access = $this->accessList()->where('user_id', $userId)->first();
        return $access ? $access->access_level : 0;
    }
}
