<?php

namespace App\Http\Controllers;

use App\Models\NotebookEntry;
use App\Models\NotebookFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotebookController extends Controller
{
    public function listFolders()
    {
        return response()->json(
            NotebookFolder::orderBy('created_at')->get()->map(fn ($folder) => ['id' => (string) $folder->id, 'name' => $folder->name])
        );
    }

    public function createFolder(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $folder = NotebookFolder::create(['name' => $validated['name']]);

        return response()->json(['id' => (string) $folder->id, 'name' => $folder->name]);
    }

    public function index(Request $request)
    {
        $query = NotebookEntry::query();

        if ($request->has('folderId') && $request->folderId) {
            $query->where('folder_id', $request->folderId);
        }

        return response()->json($query->orderByDesc('updated_at')->get()->map(fn ($entry) => $this->serializeEntry($entry)));
    }

    public function show(NotebookEntry $entry)
    {
        return response()->json($this->serializeEntry($entry));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'folderId' => ['required', 'string'],
            'projectId' => ['nullable', 'string'],
            'title' => ['required', 'string'],
            'status' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
        ]);

        $entry = NotebookEntry::create([
            'folder_id' => $validated['folderId'],
            'project_id' => $validated['projectId'] ?? null,
            'title' => $validated['title'],
            'status' => $validated['status'] ?? 'Draft',
            'content' => $validated['content'] ?? '',
            'author' => Auth::user()?->name ?? 'Dr. Evelyn Thorne',
            'date' => now()->toDateString(),
        ]);

        return response()->json($this->serializeEntry($entry));
    }

    public function update(Request $request, NotebookEntry $entry)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string'],
            'content' => ['sometimes', 'string'],
        ]);

        if (isset($validated['title'])) {
            $entry->title = $validated['title'];
        }

        if (isset($validated['content'])) {
            $entry->content = $validated['content'];
        }

        $entry->save();

        return response()->json($this->serializeEntry($entry));
    }

    public function sign(NotebookEntry $entry)
    {
        $entry->status = 'Approved';
        $entry->save();

        return response()->json($this->serializeEntry($entry));
    }

    protected function serializeEntry(NotebookEntry $entry): array
    {
        return [
            'id' => (string) $entry->id,
            'folderId' => (string) $entry->folder_id,
            'projectId' => $entry->project_id ? (string) $entry->project_id : '',
            'title' => $entry->title,
            'status' => $entry->status,
            'content' => $entry->content,
            'author' => $entry->author ?? 'Dr. Evelyn Thorne',
            'date' => $entry->date ?? $entry->created_at?->toDateString(),
        ];
    }
}
