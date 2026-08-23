<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'status',
        'banner',
        'progress',
        'last_activity',
        'members',
    ];

    protected $casts = [
        'members' => 'array',
        'last_activity' => 'datetime',
    ];

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class);
    }
}
