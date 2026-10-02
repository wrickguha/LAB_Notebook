<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SharedResource extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'owner',
        'shared_with',
        'last_modified',
    ];

    protected $casts = [
        'shared_with' => 'array',
    ];
}
