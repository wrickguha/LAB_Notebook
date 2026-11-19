<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileRecord extends Model
{
    use HasFactory;

    protected $table = 'files';

    protected $fillable = [
        'user_id',
        'project_id',
        'notebook_entry_id',
        'filename',
        'original_name',
        'path',
        'mime_type',
        'size_bytes',
        'storage_disk',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function notebookEntry(): BelongsTo
    {
        return $this->belongsTo(NotebookEntry::class);
    }
}
