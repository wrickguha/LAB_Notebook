<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetMail;
use App\Mail\WelcomeMail;
use App\Models\User;
use App\Services\CaptchaService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private CaptchaService $captcha) {}

    public function signup(Request $request)
    {
        // 1. Bot & Captcha verification
        $token = $request->input('captcha_token') ?? $request->input('cf_turnstile_token');
        if (!$this->captcha->verify($token, $request->ip())) {
            throw ValidationException::withMessages([
                'captcha' => ['Security verification failed. Please refresh and try again.'],
            ]);
        }

        // 2. Input validation
        $validated = $request->validate([
            'email'       => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'    => ['required', 'string', 'min:8'],
            'full_name'   => ['required', 'string', 'max:255'],
            'role'        => ['nullable', 'string', 'max:255'],
            'institution' => ['nullable', 'string', 'max:255'],
            'lab'         => ['nullable', 'string', 'max:255'],
        ]);

        // 3. User creation
        $user = User::create([
            'name'             => trim($validated['full_name']),
            'email'            => strtolower(trim($validated['email'])),
            'password'         => Hash::make($validated['password']),
            'role'             => $validated['role'] ?? 'Principal Investigator',
            'institution'      => $validated['institution'] ?? '',
            'lab'              => $validated['lab'] ?? '',
            'theme_preference' => 'light',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        // 4. Notifications & Emails (non-blocking)
        try {
            NotificationService::send(
                $user->id,
                'Welcome to InveniqLab',
                'Your research environment is configured and ready. Start by initializing a project or opening your digital lab notebook.',
                'account'
            );

            if (filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
                Mail::to($user->email)->send(new WelcomeMail($user));
            }
        } catch (\Throwable $e) {
            // Log but don't fail registration
            \Illuminate\Support\Facades\Log::warning('Welcome notification/email issue: ' . $e->getMessage());
        }

        return response()->json([
            'user'    => $this->serializeUser($user),
            'message' => 'Account created successfully',
        ], 201);
    }

    public function signin(Request $request)
    {
        // 1. Bot & Captcha check
        $token = $request->input('captcha_token') ?? $request->input('cf_turnstile_token');
        if (!$this->captcha->verify($token, $request->ip())) {
            throw ValidationException::withMessages([
                'captcha' => ['Security verification failed. Please refresh and try again.'],
            ]);
        }

        // 2. Credentials validation
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt(['email' => strtolower(trim($credentials['email'])), 'password' => $credentials['password']], (bool) $request->input('remember', true))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $request->session()->regenerate();
        $user = Auth::user();

        // Notification for login
        try {
            NotificationService::send(
                $user->id,
                'Successful Sign-in',
                'Signed in from IP ' . $request->ip() . ' at ' . now()->toFormattedDateString() . ' ' . now()->toTimeString(),
                'security'
            );
        } catch (\Throwable $e) {
            // Ignore
        }

        return response()->json([
            'user'    => $this->serializeUser($user),
            'message' => 'Signed in successfully',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me()
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json($this->serializeUser($user));
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', strtolower(trim($request->email)))->first();

        if ($user) {
            $resetCode = strtoupper(Str::random(6));
            $user->password_reset_code = Hash::make($resetCode);
            $user->password_reset_expires_at = now()->addHour();
            $user->save();

            $resetUrl = url('/auth?reset=1&email=' . urlencode($user->email));

            try {
                Mail::to($user->email)->send(new PasswordResetMail($user, $resetCode, $resetUrl));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Password reset email failed: ' . $e->getMessage());
            }
        }

        // Always return generic success to prevent email enumeration
        return response()->json([
            'message' => 'If an account matches that email, a password reset code has been sent.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'code'     => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::where('email', strtolower(trim($request->email)))->first();

        if (! $user || ! $user->password_reset_code || ! $user->password_reset_expires_at || $user->password_reset_expires_at->isPast()) {
            throw ValidationException::withMessages([
                'code' => ['This password reset code is invalid or has expired.'],
            ]);
        }

        if (! Hash::check(strtoupper(trim($request->code)), $user->password_reset_code)) {
            throw ValidationException::withMessages([
                'code' => ['The verification code entered is incorrect.'],
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->password_reset_code = null;
        $user->password_reset_expires_at = null;
        $user->save();

        NotificationService::send(
            $user->id,
            'Password Changed',
            'Your account password was updated successfully at ' . now()->toDayDateTimeString(),
            'security'
        );

        return response()->json(['message' => 'Password has been successfully updated.']);
    }

    public function serializeUser(User $user): array
    {
        return [
            'id'               => $user->id,
            'name'             => $user->name,
            'role'             => $user->role ?? 'Principal Investigator',
            'email'            => $user->email,
            'institution'      => $user->institution ?? '',
            'lab'              => $user->lab ?? '',
            'avatar'           => $user->avatar ?? null,
            'theme_preference' => $user->theme_preference ?? 'light',
        ];
    }
}
