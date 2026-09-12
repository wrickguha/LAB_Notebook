<?php

namespace App\Http\Controllers;

use App\Models\NotebookEntry;
use App\Models\NotebookFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotebookController extends Controller
{
    /** List only folders that belong to the authenticated user. */
    public function listFolders()
    {
        return response()->json(
            NotebookFolder::where(''user_id'', Auth::id())
                ->orderBy(''created_at'')
                ->get()
                ->map(fn ($folder) => [''id'' => (string) $folder->id, ''name'' => $folder->name])
        );
    }

    public function createFolder(Request $request)
    {
        $validated = $request->validate([
            ''name'' => [''required'', ''string'', ''max:255''],
        ]);

        $folder = NotebookFolder::create([
            ''user_id'' => Auth::id(),
            ''name''    => $validated[''name''],
        ]);

        return response()->json([''id'' => (string) $folder->id, ''name'' => $folder->name]);
    }

    /** List only entries belonging to the authenticated user. */
    public function index(Request $request)
    {
        $query = NotebookEntry::where(''user_id'', Auth::id());

        if ($request->has(''folderId'') && $request->folderId) {
            $query->where(''folder_id'', $request->folderId);
        }

        return response()->json(
            $query->orderByDesc(''updated_at'')->get()->map(fn ($e) => $this->serializeEntry($e))
        );
    }

    public function show(NotebookEntry $entry)
    {
        if ($entry->user_id !== null && $entry->user_id !== Auth::id()) {
            return response()->json([''message'' => ''Forbidden''], 403);
        }
        return response()->json($this->serializeEntry($entry));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            ''folderId''  => [''required'', ''string''],
            ''projectId'' => [''nullable'', ''string''],
            ''title''     => [''required'', ''string''],
            ''status''    => [''nullable'', ''string''],
            ''content''   => [''nullable'', ''string''],
        ]);

        $entry = NotebookEntry::create([
            ''user_id''    => Auth::id(),
            ''folder_id''  => $validated[''folderId''],
            ''project_id'' => $validated[''projectId''] ?? null,
            ''title''      => $validated[''title''],
            ''status''     => $validated[''status''] ?? ''Draft'',
            ''content''    => $validated[''content''] ?? '''',
            ''author''     => Auth::user()?->name ?? ''Lab Researcher'',
            ''date''       => now()->toDateString(),
        ]);

        return response()->json($this->serializeEntry($entry));
    }

    public function update(Request $request, NotebookEntry $entry)
    {
        if ($entry->user_id !== null && $entry->user_id !== Auth::id()) {
            return response()->json([''message'' => ''Forbidden''], 403);
        }

        $validated = $request->validate([
            ''title''   => [''sometimes'', ''string''],
            ''content'' => [''sometimes'', ''string''],
        ]);

        if (isset($validated[''title'']))   $entry->title   = $validated[''title''];
        if (isset($validated[''content''])) $entry->content = $validated[''content''];

        $entry->save();

        return response()->json($this->serializeEntry($entry));
    }

    public function sign(NotebookEntry $entry)
    {
        if ($entry->user_id !== null && $entry->user_id !== Auth::id()) {
            return response()->json([''message'' => ''Forbidden''], 403);
        }

        $entry->status = ''Approved'';
        $entry->save();

        return response()->json($this->serializeEntry($entry));
    }

    protected function serializeEntry(NotebookEntry $entry): array
    {
        return [
            ''id''        => (string) $entry->id,
            ''folderId''  => (string) $entry->folder_id,
            ''projectId'' => $entry->project_id ? (string) $entry->project_id : '''',
            ''title''     => $entry->title,
            ''status''    => $entry->status,
            ''content''   => $entry->content,
            ''author''    => $entry->author ?? ''Lab Researcher'',
            ''date''      => $entry->date ?? $entry->created_at?->toDateString(),
        ];
    }
}
