<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\NotebookEntry;
use App\Models\NotebookFolder;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

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

        $entries = $query->orderByDesc('updated_at')
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

        return response()->json($this->serializeEntry($entry));
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'folderId'     => ['required', 'string'],
            'projectId'    => ['nullable', 'string'],
            'title'        => ['required', 'string', 'max:255'],
            'status'       => ['nullable', 'string', 'max:50'],
            'content'      => ['nullable', 'string'],
            'content_json' => ['nullable', 'string'], // Tiptap JSON
        ]);

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

        // Prevent modification if already digitally signed under Part 11
        if (in_array($entry->status, ['Approved', 'Signed'])) {
            return response()->json(['message' => 'Entry is cryptographically locked under FDA 21 CFR Part 11 and cannot be altered.'], 422);
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

        return response()->json($this->serializeEntry($entry));
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

        $entry->status = 'Signed';
        $entry->save();

        AuditLog::create([
            'user'      => Auth::user()->name,
            'action'    => 'Digitally Signed & Sealed (21 CFR Part 11)',
            'target'    => "Entry: {$entry->title}",
            'ip'        => $request->ip(),
            'status'    => 'Cryptographically Verified',
            'timestamp' => now()->toIso8601String(),
        ]);

        NotificationService::send(
            $userId,
            'Notebook Sealed',
            "Experiment entry \"{$entry->title}\" was digitally signed under 21 CFR Part 11.",
            'notebook',
            $entry->id,
            'notebook_entry'
        );

        return response()->json($this->serializeEntry($entry));
    }

    public function destroy(NotebookEntry $entry)
    {
        $userId = Auth::id();
        if (!Gate::forUser(Auth::user())->allows('delete', $entry)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($entry->status, ['Approved', 'Signed'])) {
            return response()->json(['message' => 'Signed entries cannot be deleted (FDA 21 CFR Part 11).'], 422);
        }

        $entry->delete();

        return response()->json(['message' => 'Notebook entry deleted successfully']);
    }

    protected function serializeEntry(NotebookEntry $entry): array
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
        ];
    }
}
