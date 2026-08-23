<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchPaper extends Model
{
    protected $fillable = [
        'title',
        'authors',
        'journal',
        'year',
        'doi',
        'summary',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'year' => 'integer',
    ];
}
