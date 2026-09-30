<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotebookEntry extends Model
{
    use HasFactory;

    protected $table = 'notebook_entries';

    protected $fillable = [
        'user_id',
        'folder_id',
        'project_id',
        'title',
        'status',
        'content',
        'content_json',
        'author',
        'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(NotebookFolder::class, 'folder_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(FileRecord::class, 'notebook_entry_id');
    }
}
