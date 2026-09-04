<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function updateCurrentUser(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'role' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'institution' => ['sometimes', 'nullable', 'string', 'max:255'],
            'lab' => ['sometimes', 'nullable', 'string', 'max:255'],
            'avatar' => ['sometimes', 'nullable', 'string'],
        ]);

        $user->fill($validated);
        $user->save();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role ?? 'Principal Investigator',
            'email' => $user->email,
            'institution' => $user->institution ?? '',
            'lab' => $user->lab ?? '',
            'avatar' => $user->avatar ?? null,
        ]);
    }
}
