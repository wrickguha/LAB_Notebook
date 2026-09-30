@extends('emails.layout')

@section('content')
  <h2 class="greeting">Welcome to InveniqLab, {{ $user->name }}!</h2>
  <p>Your electronic laboratory notebook and research management account has been created successfully.</p>
  <p>With InveniqLab, you can:</p>
  <ul>
    <li>Document research with FDA 21 CFR Part 11 electronic records.</li>
    <li>Persist experiment observations in structured rich-text notebooks.</li>
    <li>Manage research projects, milestones, and cross-lab collaboration.</li>
    <li>Schedule lab appointments, trials, and project deadlines with your internal calendar.</li>
  </ul>
  <div class="action-button-container">
    <a href="{{ $actionUrl ?? config('app.url') }}" class="action-button">Open Your Research Dashboard</a>
  </div>
  <p>If you have any questions or require assistance, our support team is available at <a href="mailto:support@inveniqlab.com">support@inveniqlab.com</a>.</p>
@endsection
