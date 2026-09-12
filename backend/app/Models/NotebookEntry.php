<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotebookEntry extends Model
{
    protected $fillable = [
        'user_id',
        'folder_id',
        'project_id',
        'title',
        'status',
        'content',
        'author',
        'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
