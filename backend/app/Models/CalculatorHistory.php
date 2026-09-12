<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalculatorHistory extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'calculator_name',
        'formula',
        'input',
        'result',
        'input_json',
        'output_json',
        'project_id',
    ];

    protected $casts = [
        'input_json'  => 'array',
        'output_json' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
