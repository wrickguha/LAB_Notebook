<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalculatorHistory extends Model
{
    protected $table = 'calculator_history';

    protected $fillable = [
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
        'input_json' => 'array',
        'output_json' => 'array',
        'project_id' => 'integer',
    ];
}
