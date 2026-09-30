@extends('emails.layout')

@section('content')
  <h2 class="greeting">Research Project Access Granted</h2>
  <p>Hello {{ $recipient->name }},</p>
  <p><strong>{{ $inviter->name }}</strong> has granted you <strong>{{ $levelName }}</strong> access to the following research project:</p>
  
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #0d9488; text-transform: uppercase;">
      {{ $project->code }}
    </div>
    <h3 style="margin: 4px 0 8px 0; color: #0f172a; font-size: 16px; font-weight: 800;">
      {{ $project->name }}
    </h3>
    <p style="margin: 0; font-size: 12px; color: #64748b;">
      {{ Str::limit($project->description, 150) }}
    </p>
  </div>

  <div class="action-button-container">
    <a href="{{ $projectUrl }}" class="action-button">Open Research Project</a>
  </div>
@endsection
