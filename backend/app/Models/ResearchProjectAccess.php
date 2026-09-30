<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchProjectAccess extends Model
{
    use HasFactory;

    protected $table = 'research_project_access';

    protected $fillable = [
        'project_id',
        'user_id',
        'access_level',
        'invited_by',
    ];

    protected $casts = [
        'access_level' => 'integer', // 1=View, 2=Edit, 3=Admin
    ];

    public const LEVEL_VIEW = 1;
    public const LEVEL_EDIT = 2;
    public const LEVEL_ADMIN = 3;

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}
