<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleCalendarConnection extends Model
{
    protected $fillable = ['user_id', 'google_account_email', 'access_token', 'refresh_token', 'expires_at'];

    protected $hidden = ['access_token', 'refresh_token'];

    protected $casts = [
        'access_token' => 'encrypted:array',
        'refresh_token' => 'encrypted:string',
        'expires_at' => 'datetime',
    ];
}