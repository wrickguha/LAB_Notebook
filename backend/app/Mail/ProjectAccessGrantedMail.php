<?php

namespace App\Mail;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectAccessGrantedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $recipient,
        public User $inviter,
        public Project $project,
        public string $levelName,
        public string $projectUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'InveniqLab — Project Access Granted: ' . $this->project->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.project-access',
            with: [
                'recipient'  => $this->recipient,
                'inviter'    => $this->inviter,
                'project'    => $this->project,
                'levelName'  => $this->levelName,
                'projectUrl' => $this->projectUrl,
            ],
        );
    }
}
