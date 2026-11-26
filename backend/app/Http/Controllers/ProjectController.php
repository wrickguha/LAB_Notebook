<?php

namespace App\Http\Controllers;

use App\Mail\ProjectAccessGrantedMail;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ResearchProjectAccess;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProjectController extends Controller
{
    /** Return projects owned by or shared with the authenticated user. */
    public function index()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $projects = Project::with(['milestones', 'accessList.user', 'user'])
            ->withCount(['experiments', 'files'])
            ->accessibleBy($userId)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn ($p) => $this->serializeProject($p, $userId));

        return response()->json($projects);
    }

    public function show(Project $project)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('view', $project)) {
            return response()->json(['message' => 'Forbidden: You do not have access to this research project.'], 403);
        }

        return response()->json($this->serializeProject($project->load(['milestones', 'accessList.user', 'user']), $userId));
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'code'        => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'research_area' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'content'     => ['nullable', 'string'], // Tiptap canonical JSON
            'status'      => ['nullable', 'string', 'max:50'],
            'banner'      => ['nullable', 'string', 'max:7100000'],
            'progress'    => ['nullable', 'integer', 'min:0', 'max:100'],
            'milestones'  => ['nullable', 'array'],
            'members'     => ['nullable', 'array'],
        ]);

        $banner = isset($validated['banner'])
            ? $this->processBanner($validated['banner'])
            : 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800';

        $project = Project::create([
            'user_id'       => $userId,
            'name'          => trim($validated['name']),
            'code'          => strtoupper(trim($validated['code'])),
            'description'   => $validated['description'] ?? '',
            'research_area' => $validated['research_area'] ?? null,
            'start_date'    => $validated['start_date'] ?? null,
            'end_date'      => $validated['end_date'] ?? null,
            'content'       => $validated['content'] ?? null,
            'status'        => $validated['status'] ?? 'Active',
            'banner'        => $banner,
            'progress'      => $validated['progress'] ?? 0,
            'members'       => $validated['members'] ?? [
                ['name' => Auth::user()?->name ?? 'Principal Investigator', 'role' => Auth::user()?->role ?? 'Principal Investigator', 'avatar' => Auth::user()?->avatar],
            ],
            'last_activity' => now(),
        ]);

        foreach ($validated['milestones'] ?? [] as $milestone) {
            if (!empty($milestone['name'])) {
                $project->milestones()->create([
                    'name'      => trim($milestone['name']),
                    'completed' => (bool) ($milestone['completed'] ?? false),
                ]);
            }
        }

        NotificationService::send(
            $userId,
            'Project Initialized',
            "Research Project \"{$project->name}\" ({$project->code}) has been registered.",
            'project',
            $project->id,
            'project'
        );

        return response()->json($this->serializeProject($project->load(['milestones', 'accessList.user', 'user']), $userId), 201);
    }

    public function update(Request $request, Project $project)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden: You do not have permission to edit this project.'], 403);
        }

        $validated = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'code'        => ['sometimes', 'required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'research_area' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'content'     => ['nullable', 'string'], // Tiptap canonical JSON
            'status'      => ['nullable', 'string', 'max:50'],
            'banner'      => ['nullable', 'string', 'max:7100000'],
            'progress'    => ['nullable', 'integer', 'min:0', 'max:100'],
            'milestones'  => ['nullable', 'array'],
            'members'     => ['nullable', 'array'],
        ]);

        $oldBanner = $project->banner;
        $banner = array_key_exists('banner', $validated)
            ? $this->processBanner($validated['banner'])
            : $project->banner;

        $project->fill([
            'name'          => isset($validated['name']) ? trim($validated['name']) : $project->name,
            'code'          => isset($validated['code']) ? strtoupper(trim($validated['code'])) : $project->code,
            'description'   => array_key_exists('description', $validated) ? $validated['description'] : $project->description,
            'research_area' => array_key_exists('research_area', $validated) ? $validated['research_area'] : $project->research_area,
            'start_date'    => array_key_exists('start_date', $validated) ? $validated['start_date'] : $project->start_date,
            'end_date'      => array_key_exists('end_date', $validated) ? $validated['end_date'] : $project->end_date,
            'content'       => array_key_exists('content', $validated) ? $validated['content'] : $project->content,
            'status'        => $validated['status'] ?? $project->status,
            'banner'        => $banner,
            'progress'      => array_key_exists('progress', $validated) ? $validated['progress'] : $project->progress,
            'members'       => $validated['members'] ?? $project->members,
            'last_activity' => now(),
        ]);
        $project->save();
        if (array_key_exists('banner', $validated) && $banner !== $oldBanner) {
            $this->deleteManagedBanner($oldBanner);
        }

        if (isset($validated['milestones'])) {
            $project->milestones()->delete();
            foreach ($validated['milestones'] as $milestone) {
                if (is_array($milestone) && !empty($milestone['name'])) {
                    $project->milestones()->create([
                        'name'      => trim($milestone['name']),
                        'completed' => (bool) ($milestone['completed'] ?? false),
                    ]);
                } elseif (is_string($milestone) && trim($milestone) !== '') {
                    $project->milestones()->create([
                        'name'      => trim($milestone),
                        'completed' => false,
                    ]);
                }
            }
        }

        $this->notifyCollaborators(
            $project,
            $userId,
            'Research project updated',
            "Project \"{$project->name}\" was updated."
        );

        return response()->json($this->serializeProject($project->load(['milestones', 'accessList.user', 'user']), $userId));
    }

    /**
     * Auto-save Tiptap editor content.
     */
    public function saveContent(Request $request, Project $project)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string'],
            'title'   => ['nullable', 'string', 'max:255'],
        ]);

        $project->content = $validated['content'];
        if (!empty($validated['title'])) {
            $project->name = trim($validated['title']);
        }
        $project->last_activity = Carbon::now();
        $project->save();

        return response()->json([
            'message'       => 'Document saved successfully',
            'last_activity' => $project->last_activity->toISOString(),
        ]);
    }

    public function toggleMilestone(Project $project, ProjectMilestone $milestone)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($milestone->project_id !== $project->id) {
            return response()->json(['message' => 'Milestone not found for project'], 404);
        }

        $milestone->completed = ! $milestone->completed;
        $milestone->save();

        $project->refresh();
        $milestones = $project->milestones()->get();
        $completed  = $milestones->where('completed', true)->count();
        $total      = $milestones->count();
        $project->progress      = $total > 0 ? (int) round(($completed / $total) * 100) : 0;
        $project->last_activity = Carbon::now();
        $project->save();

        $this->notifyCollaborators(
            $project,
            $userId,
            'Project milestone updated',
            "A milestone in project \"{$project->name}\" was updated."
        );

        return response()->json($this->serializeProject($project->load(['milestones', 'accessList.user', 'user']), $userId));
    }

    public function uploadBanner(Request $request, Project $project)
    {
        if (!Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'image' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'mimetypes:image/jpeg,image/png,image/webp,image/gif',
                'max:5120',
            ],
        ]);

        $userId = Auth::id();
        $image = $validated['image'];
        $filename = Str::random(40) . '.' . $image->extension();
        $path = $image->storeAs('project-banners/' . $userId, $filename, 'public');
        if (!$path) {
            throw new \RuntimeException('Unable to store the project banner image.');
        }
        $oldBanner = $project->banner;

        $project->forceFill([
            'banner' => Storage::disk('public')->url($path),
            'last_activity' => now(),
        ])->save();

        $this->deleteManagedBanner($oldBanner);

        return response()->json([
            'banner' => $project->banner,
            'project' => $this->serializeProject(
                $project->load(['milestones', 'accessList.user', 'user']),
                $userId
            ),
        ]);
    }

    public function share(Request $request, Project $project)
    {
        $userId = Auth::id();
        if (!Gate::forUser(Auth::user())->allows('share', $project)) {
            return response()->json(['message' => 'Forbidden: Only project owners or managers can grant access.'], 403);
        }

        $validated = $request->validate([
            'email'        => ['required', 'email'],
            'access_level' => ['required', 'integer', 'in:1,2,3'], // 1=View, 2=Edit, 3=Admin
        ]);

        $targetUser = User::where('email', strtolower(trim($validated['email'])))->first();

        if (!$targetUser) {
            return response()->json(['message' => 'No registered researcher found with that email address.'], 404);
        }

        if ($targetUser->id === $project->user_id) {
            return response()->json(['message' => 'The project owner already has full administrator access.'], 422);
        }

        $access = ResearchProjectAccess::updateOrCreate(
            ['project_id' => $project->id, 'user_id' => $targetUser->id],
            ['access_level' => $validated['access_level'], 'invited_by' => $userId]
        );

        $levels = [1 => 'Viewer', 2 => 'Editor', 3 => 'Administrator'];
        $levelName = $levels[$validated['access_level']];

        // Send In-app notification
        NotificationService::send(
            $targetUser->id,
            'Project Access Granted',
            Auth::user()->name . " granted you {$levelName} permissions on project \"{$project->name}\".",
            'project',
            $project->id,
            'project'
        );

        // Send Email
        try {
            Mail::to($targetUser->email)->send(new ProjectAccessGrantedMail(
                $targetUser,
                Auth::user(),
                $project,
                $levelName,
                url("/dashboard")
            ));
        } catch (\Throwable $e) {
            // Ignore mail failure
        }

        return response()->json([
            'message' => "Access granted successfully to {$targetUser->name}.",
            'access'  => [
                'userId'      => (string) $targetUser->id,
                'userName'    => $targetUser->name,
                'userEmail'   => $targetUser->email,
                'accessLevel' => $access->access_level,
            ],
        ]);
    }

    public function revokeAccess(Project $project, User $user)
    {
        if (!Gate::forUser(Auth::user())->allows('share', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        ResearchProjectAccess::where('project_id', $project->id)
            ->where('user_id', $user->id)
            ->delete();

        NotificationService::send(
            $user->id,
            'Project Access Revoked',
            "Your access to project \"{$project->name}\" was removed.",
            'project'
        );

        return response()->json(['message' => 'Access revoked successfully.']);
    }

    public function destroy(Project $project)
    {
        if (!Gate::forUser(Auth::user())->allows('delete', $project)) {
            return response()->json(['message' => 'Forbidden: Only the project owner can delete this project.'], 403);
        }

        foreach ($project->files()->get() as $file) {
            $disk = Storage::disk($file->storage_disk ?: 'public');
            if ($disk->exists($file->path) && !$disk->delete($file->path)) {
                throw new \RuntimeException('Unable to delete a stored project file.');
            }
        }
        $this->deleteManagedBanner($project->banner);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    protected function serializeProject(object $project, int $currentUserId): array
    {
        $milestones = $project->milestones->map(fn ($item) => [
            'id'        => (string) $item->id,
            'name'      => $item->name,
            'completed' => (bool) $item->completed,
        ])->values()->all();

        $collaborators = $project->accessList->map(fn ($acc) => [
            'userId'      => (string) $acc->user_id,
            'name'        => $acc->user?->name ?? 'Researcher',
            'email'       => $acc->user?->email,
            'role'        => $acc->user?->role ?? 'Collaborator',
            'avatar'      => $acc->user?->avatar,
            'accessLevel' => (int) $acc->access_level,
        ])->values()->all();

        $isOwner = $project->user_id === $currentUserId;
        $userLevel = $isOwner
            ? 3
            : (int) ($project->accessList->firstWhere('user_id', $currentUserId)?->access_level ?? 0);

        return [
            'id'           => (string) $project->id,
            'name'         => $project->name,
            'code'         => $project->code,
            'description'  => $project->description,
            'researchArea' => $project->research_area,
            'startDate'    => $project->start_date?->format('Y-m-d'),
            'endDate'      => $project->end_date?->format('Y-m-d'),
            'content'      => $project->content, // Tiptap structured JSON or text
            'status'       => $project->status,
            'banner'       => $project->banner,
            'progress'     => (int) $project->progress,
            'lastActivity' => $project->last_activity?->toISOString() ?? $project->updated_at?->toISOString(),
            'owner'        => [
                'id'     => (string) $project->user_id,
                'name'   => $project->user?->name ?? 'Principal Investigator',
                'email'  => $project->user?->email,
                'avatar' => $project->user?->avatar,
            ],
            'isOwner'            => $isOwner,
            'accessLevel'        => $userLevel, // 1=View, 2=Edit, 3=Admin
            'members'            => $project->members ?? [],
            'collaborators'      => $collaborators,
            'milestones'         => $milestones,
            'experimentsCount'   => $project->experiments_count ?? $project->experiments()->count(),
            'filesCount'         => $project->files_count ?? $project->files()->count(),
            'teamCount'          => $collaborators ? count($collaborators) + 1 : 1, // +1 for owner
        ];
    }

    private function notifyCollaborators(Project $project, int $actorId, string $title, string $message): void
    {
        $recipientIds = $project->accessList()
            ->pluck('user_id')
            ->push($project->user_id)
            ->unique()
            ->reject(fn ($recipientId) => (int) $recipientId === $actorId);

        foreach ($recipientIds as $recipientId) {
            NotificationService::send(
                (int) $recipientId,
                $title,
                $message,
                'project',
                $project->id,
                'project'
            );
        }
    }

    protected function processBanner(?string $banner): ?string
    {
        if (!$banner) {
            return $banner;
        }

        if (str_starts_with($banner, 'data:')) {
            if (!preg_match('/^data:image\/(jpeg|jpg|png|gif|webp);base64,(.+)$/s', $banner, $type)) {
                throw ValidationException::withMessages([
                    'banner' => 'The banner must be a JPEG, PNG, GIF, or WebP image.',
                ]);
            }

            $data = substr($banner, strpos($banner, ',') + 1);
            $decoded = base64_decode($data, true);
            if ($decoded === false || strlen($decoded) > 5 * 1024 * 1024) {
                throw ValidationException::withMessages([
                    'banner' => 'The banner image is invalid or exceeds the 5 MB limit.',
                ]);
            }

            $mime = (new \finfo(FILEINFO_MIME_TYPE))->buffer($decoded);
            $extensions = [
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp',
            ];
            if (!isset($extensions[$mime])) {
                throw ValidationException::withMessages([
                    'banner' => 'The banner must contain a supported image format.',
                ]);
            }

            $userId = Auth::id();
            $filename = 'project-banners/' . $userId . '/' . Str::random(40) . '.' . $extensions[$mime];
            if (!Storage::disk('public')->put($filename, $decoded)) {
                throw new \RuntimeException('Unable to store the project banner image.');
            }
            return Storage::disk('public')->url($filename);
        }

        $scheme = parse_url($banner, PHP_URL_SCHEME);
        if (str_starts_with($banner, '/storage/') || in_array($scheme, ['http', 'https'], true)) {
            return $banner;
        }

        throw ValidationException::withMessages([
            'banner' => 'The banner must be an HTTP(S) URL or a supported image.',
        ]);
    }

    private function deleteManagedBanner(?string $banner): void
    {
        if (!$banner) {
            return;
        }

        $path = parse_url($banner, PHP_URL_PATH);
        if (!is_string($path) || !str_starts_with($path, '/storage/')) {
            return;
        }

        $storedPath = substr($path, strlen('/storage/'));
        if (preg_match('#^project-banners/\d+/[A-Za-z0-9]{40}\.(jpg|png|gif|webp)$#', $storedPath)) {
            $disk = Storage::disk('public');
            if ($disk->exists($storedPath) && !$disk->delete($storedPath)) {
                throw new \RuntimeException('Unable to delete the stored project banner.');
            }
        }
    }
}
