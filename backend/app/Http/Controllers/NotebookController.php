<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\NotebookEntry;
use App\Models\NotebookFolder;
use App\Models\Project;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class NotebookController extends Controller
{
    /** List only folders that belong to the authenticated user. */
    public function listFolders()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json(
            NotebookFolder::where('user_id', $userId)
                ->orderBy('created_at')
                ->get()
                ->map(fn ($folder) => ['id' => (string) $folder->id, 'name' => $folder->name])
        );
    }

    public function createFolder(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $folder = NotebookFolder::create([
            'user_id' => $userId,
            'name'    => trim($validated['name']),
        ]);

        return response()->json(['id' => (string) $folder->id, 'name' => $folder->name], 201);
    }

    /** List entries belonging to authenticated user. */
    public function index(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $query = NotebookEntry::where('user_id', $userId);

        if ($request->filled('folderId')) {
            $query->where('folder_id', $request->input('folderId'));
        }

        if ($request->filled('projectId')) {
            $query->where('project_id', $request->input('projectId'));
        }

        $entries = $query->with('signer')->orderByDesc('updated_at')
            ->get()
            ->map(fn ($e) => $this->serializeEntry($e));

        return response()->json($entries);
    }

    public function show(NotebookEntry $entry)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('view', $entry)) {
            return response()->json(['message' => 'Forbidden: You do not have access to this notebook entry.'], 403);
        }

        return response()->json($this->serializeEntry($entry->load('signer')));
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'folderId'     => ['required', 'integer', Rule::exists('notebook_folders', 'id')->where('user_id', $userId)],
            'projectId'    => ['nullable', 'integer', Rule::exists('projects', 'id')],
            'title'        => ['required', 'string', 'max:255'],
            'status'       => ['nullable', 'string', 'max:50'],
            'content'      => ['nullable', 'string'],
            'content_json' => ['nullable', 'string'], // Tiptap JSON
        ]);

        if (!empty($validated['projectId'])) {
            $project = Project::findOrFail($validated['projectId']);
            if (!Gate::forUser(Auth::user())->allows('view', $project)) {
                return response()->json(['message' => 'You do not have access to the selected project.'], 403);
            }
        }

        $entry = NotebookEntry::create([
            'user_id'      => $userId,
            'folder_id'    => $validated['folderId'],
            'project_id'   => $validated['projectId'] ?? null,
            'title'        => trim($validated['title']),
            'status'       => $validated['status'] ?? 'Draft',
            'content'      => $validated['content'] ?? '',
            'content_json' => $validated['content_json'] ?? null,
            'author'       => Auth::user()?->name ?? 'Lab Researcher',
            'date'         => now()->toDateString(),
        ]);

        AuditLog::create([
            'user_id'   => $userId,
            'user'      => Auth::user()->name,
            'action'    => 'Created notebook draft',
            'target'    => $entry->title,
            'ip'        => $request->ip(),
            'status'    => 'Verified',
            'timestamp' => now()->toIso8601String(),
        ]);

        return response()->json($this->serializeEntry($entry), 201);
    }

    public function update(Request $request, NotebookEntry $entry)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('update', $entry)) {
            return response()->json(['message' => 'Forbidden: Cannot modify this notebook entry.'], 403);
        }

        if (in_array($entry->status, ['Approved', 'Signed'])) {
            return response()->json(['message' => 'Signed notebook entries are locked and cannot be changed.'], 422);
        }

        $validated = $request->validate([
            'title'        => ['sometimes', 'string', 'max:255'],
            'content'      => ['sometimes', 'nullable', 'string'],
            'content_json' => ['sometimes', 'nullable', 'string'],
        ]);

        if (isset($validated['title']))        $entry->title        = trim($validated['title']);
        if (array_key_exists('content', $validated))      $entry->content      = $validated['content'];
        if (array_key_exists('content_json', $validated)) $entry->content_json = $validated['content_json'];

        $entry->save();

        return response()->json($this->serializeEntry($entry->load('signer')));
    }

    /**
     * Auto-save Tiptap content with debounce.
     */
    public function autoSave(Request $request, NotebookEntry $entry)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('update', $entry)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($entry->status, ['Approved', 'Signed'])) {
            return response()->json(['message' => 'Document is sealed and locked.'], 422);
        }

        $validated = $request->validate([
            'content_json' => ['required', 'string'],
            'content'      => ['nullable', 'string'],
            'title'        => ['nullable', 'string', 'max:255'],
        ]);

        $entry->content_json = $validated['content_json'];
        if (isset($validated['content'])) {
            $entry->content = $validated['content'];
        }
        if (!empty($validated['title'])) {
            $entry->title = trim($validated['title']);
        }
        $entry->save();

        return response()->json([
            'message'    => 'Auto-saved successfully',
            'updated_at' => $entry->updated_at->toISOString(),
        ]);
    }

    public function sign(Request $request, NotebookEntry $entry)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (!Gate::forUser(Auth::user())->allows('update', $entry)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($entry->status, ['Approved', 'Signed'])) {
            return response()->json(['message' => 'This notebook entry has already been signed.'], 422);
        }

        $entry->status = 'Signed';
        $entry->signed_by = $userId;
        $entry->signed_at = Carbon::now();
        $entry->signature_hash = $this->calculateSignatureHash($entry);
        $entry->save();

        AuditLog::create([
            'user_id'   => $userId,
            'user'      => Auth::user()->name,
            'action'    => 'Notebook entry digitally signed',
            'target'    => "Entry #{$entry->id}; SHA-256 {$entry->signature_hash}",
            'ip'        => $request->ip(),
            'status'    => 'Recorded',
            'timestamp' => now()->toIso8601String(),
        ]);

        NotificationService::send(
            $userId,
            'Notebook Sealed',
            "Experiment entry \"{$entry->title}\" was digitally signed and locked.",
            'notebook',
            $entry->id,
            'notebook_entry'
        );

        return response()->json($this->serializeEntry($entry->load('signer')));
    }

    public function destroy(NotebookEntry $entry)
    {
        $userId = Auth::id();
        if (!Gate::forUser(Auth::user())->allows('delete', $entry)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($entry->status, ['Approved', 'Signed'])) {
            return response()->json(['message' => 'Signed notebook entries cannot be deleted.'], 422);
        }

        $entry->delete();

        return response()->json(['message' => 'Notebook entry deleted successfully']);
    }

    protected function serializeEntry(object $entry): array
    {
        return [
            'id'          => (string) $entry->id,
            'folderId'    => (string) $entry->folder_id,
            'projectId'   => $entry->project_id ? (string) $entry->project_id : '',
            'title'       => $entry->title,
            'status'      => $entry->status,
            'content'     => $entry->content,
            'contentJson' => $entry->content_json,
            'author'      => $entry->author ?? 'Lab Researcher',
            'date'        => $entry->date ?? $entry->created_at?->toDateString(),
            'updatedAt'   => $entry->updated_at?->toISOString(),
            'isSigned'    => in_array($entry->status, ['Approved', 'Signed']),
            'signedBy'    => $entry->signed_by ? (string) $entry->signed_by : null,
            'signedAt'    => $entry->signed_at?->toISOString(),
            'signatureHash' => $entry->signature_hash,
            'signatureValid' => $entry->signature_hash
                ? hash_equals($entry->signature_hash, $this->calculateSignatureHash($entry))
                : null,
            'signedByName' => $entry->signer?->name,
        ];
    }

    private function calculateSignatureHash(object $entry): string
    {
        return hash('sha256', implode('|', [
            (string) $entry->id,
            (string) $entry->signed_by,
            $entry->title,
            $entry->content ?? '',
            $entry->content_json ?? '',
            $entry->signed_at?->toISOString() ?? '',
        ]));
    }
}
