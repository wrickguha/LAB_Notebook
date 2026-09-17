<?php

namespace App\Http\Controllers;

use App\Models\GoogleCalendarConnection;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoogleCalendarController extends Controller
{
    public function __construct(private GoogleCalendarService $calendar) {}

    public function connect()
    {
        return response()->json(['url' => $this->calendar->client()->createAuthUrl()]);
    }

    public function callback(Request $request)
    {
        abort_unless($request->filled('code') && Auth::check(), 400);
        $client = $this->calendar->client();
        $token = $client->fetchAccessTokenWithAuthCode($request->string('code')->toString());
        abort_if(isset($token['error']), 422, $token['error_description'] ?? 'Google authorization failed.');
        $client->setAccessToken($token);
        $account = $client->getOAuth2Service()->userinfo->get();

        GoogleCalendarConnection::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'google_account_email' => $account->getEmail(),
                'access_token' => $token,
                'refresh_token' => $token['refresh_token'] ?? GoogleCalendarConnection::where('user_id', Auth::id())->value('refresh_token'),
                'expires_at' => now()->addSeconds($token['expires_in'] ?? 3600),
            ],
        );

        return redirect(config('services.google.frontend_redirect'));
    }

    public function status()
    {
        $connection = GoogleCalendarConnection::where('user_id', Auth::id())->first();
        return response()->json(['connected' => (bool) $connection, 'email' => $connection?->google_account_email]);
    }

    public function disconnect()
    {
        GoogleCalendarConnection::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Google Calendar disconnected']);
    }

    public function index(Request $request)
    {
        $events = $this->calendar->calendar()->events->listEvents('primary', [
            'timeMin' => $request->input('timeMin', now()->startOfDay()->toRfc3339String()),
            'timeMax' => $request->input('timeMax', now()->addMonths(3)->endOfDay()->toRfc3339String()),
            'singleEvents' => true,
            'orderBy' => 'startTime',
        ]);

        return response()->json($events->getItems());
    }

    public function store(Request $request)
    {
        $data = $request->validate(['summary' => 'required|string|max:255', 'start' => 'required|date', 'end' => 'required|date|after:start', 'description' => 'nullable|string', 'location' => 'nullable|string', 'timeZone' => 'nullable|string']);
        $event = $this->calendar->calendar()->events->insert('primary', $this->calendar->eventPayload($data));
        return response()->json($event, 201);
    }

    public function update(Request $request, string $eventId)
    {
        $data = $request->validate(['summary' => 'required|string|max:255', 'start' => 'required|date', 'end' => 'required|date|after:start', 'description' => 'nullable|string', 'location' => 'nullable|string', 'timeZone' => 'nullable|string']);
        $event = $this->calendar->calendar()->events->update('primary', $eventId, $this->calendar->eventPayload($data));
        return response()->json($event);
    }

    public function destroy(string $eventId)
    {
        $this->calendar->calendar()->events->delete('primary', $eventId);
        return response()->json(['message' => 'Calendar event deleted']);
    }
}