<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CaptchaService
{
    /**
     * Verify invisible captcha token (Cloudflare Turnstile or reCAPTCHA).
     */
    public function verify(?string $token, ?string $ip = null): bool
    {
        $secret = config('services.captcha.secret', env('CAPTCHA_SECRET'));

        // If no secret configured (e.g. local dev / testing), allow request
        if (empty($secret)) {
            return true;
        }

        if (empty($token)) {
            Log::warning('Captcha verification failed: missing token from IP ' . ($ip ?? 'unknown'));
            return false;
        }

        try {
            $isTurnstile = config('services.captcha.provider', env('CAPTCHA_PROVIDER', 'turnstile')) === 'turnstile';
            $verifyUrl = $isTurnstile
                ? 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
                : 'https://www.google.com/recaptcha/api/siteverify';

            $response = Http::asForm()->timeout(5)->post($verifyUrl, [
                'secret'   => $secret,
                'response' => $token,
                'remoteip' => $ip,
            ]);

            $result = $response->json();
            $success = (bool) ($result['success'] ?? false);

            if (!$success) {
                Log::warning('Captcha verification failed server-side', ['result' => $result, 'ip' => $ip]);
            }

            return $success;
        } catch (\Throwable $e) {
            Log::error('Captcha service exception: ' . $e->getMessage());
            // Graceful fallback if verification server is temporarily unreachable
            return app()->environment('local');
        }
    }
}
