<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotebookEntry extends Model
{
    protected $fillable = [
        'folder_id',
        'project_id',
        'title',
        'status',
        'content',
        'author',
        'date',
    ];

    public function folder(): BelongsTo
    {
        return $this->belongsTo(NotebookFolder::class, 'folder_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
