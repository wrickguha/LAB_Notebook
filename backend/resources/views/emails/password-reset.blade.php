@extends('emails.layout')

@section('content')
  <h2 class="greeting">Reset Your Password</h2>
  <p>Hello {{ $user->name }},</p>
  <p>We received a request to reset the password for your InveniqLab account.</p>
  <p>Your one-time password reset verification code is:</p>
  <div style="background-color: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0;">
    <span style="font-family: monospace; font-size: 26px; font-weight: 800; letter-spacing: 6px; color: #0d9488;">
      {{ $resetCode }}
    </span>
    <p style="font-size: 11px; color: #64748b; margin-top: 8px; margin-bottom: 0;">This code will expire in 60 minutes.</p>
  </div>
  <p>Alternatively, click the button below to proceed to the secure reset page:</p>
  <div class="action-button-container">
    <a href="{{ $resetUrl }}" class="action-button">Reset Password</a>
  </div>
  <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
@endsection
