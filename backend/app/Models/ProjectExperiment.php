<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectExperiment extends Model
{
    protected $fillable = [
        'project_id',
        'created_by',
        'sequence',
        'name',
        'objective',
        'experiment_date',
        'notes',
        'completed',
    ];

    protected $casts = [
        'experiment_date' => 'date:Y-m-d',
        'completed' => 'boolean',
        'sequence' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
