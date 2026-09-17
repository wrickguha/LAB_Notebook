<?php

namespace App\Services;

use App\Models\GoogleCalendarConnection;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Facades\Auth;

class GoogleCalendarService
{
    public function client(): Client
    {
        $client = new Client();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));
        $client->setAccessType('offline');
        $client->setPrompt('consent');
        $client->setScopes([Calendar::CALENDAR]);

        return $client;
    }

    public function calendar(): Calendar
    {
        $connection = GoogleCalendarConnection::where('user_id', Auth::id())->firstOrFail();
        $client = $this->client();
        $client->setAccessToken($connection->access_token);

        if ($client->isAccessTokenExpired() && $connection->refresh_token) {
            $token = $client->fetchAccessTokenWithRefreshToken($connection->refresh_token);
            $connection->update([
                'access_token' => $token,
                'expires_at' => now()->addSeconds($token['expires_in'] ?? 3600),
            ]);
        }

        return new Calendar($client);
    }

    public function eventPayload(array $data): Event
    {
        $event = new Event([
            'summary' => $data['summary'],
            'description' => $data['description'] ?? null,
            'location' => $data['location'] ?? null,
        ]);
        $event->setStart(new EventDateTime(['dateTime' => $data['start'], 'timeZone' => $data['timeZone'] ?? config('app.timezone')]));
        $event->setEnd(new EventDateTime(['dateTime' => $data['end'], 'timeZone' => $data['timeZone'] ?? config('app.timezone')]));

        return $event;
    }
}