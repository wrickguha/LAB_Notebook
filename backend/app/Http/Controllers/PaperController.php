<?php

namespace App\Http\Controllers;

use App\Models\ResearchPaper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaperController extends Controller
{
    public function index()
    {
        return response()->json(
            ResearchPaper::where('user_id', Auth::id())
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($paper) => $this->serializePaper($paper))
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => ['required', 'string'],
            'authors' => ['nullable', 'string'],
            'journal' => ['nullable', 'string'],
            'year'    => ['nullable', 'integer'],
            'doi'     => ['required', 'string'],
            'summary' => ['nullable', 'string'],
            'tags'    => ['nullable', 'array'],
        ]);

        $paper = ResearchPaper::create([
            'user_id' => Auth::id(),
            'title'   => $validated['title'],
            'authors' => $validated['authors'] ?? '',
            'journal' => $validated['journal'] ?? '',
            'year'    => $validated['year'] ?? date('Y'),
            'doi'     => $validated['doi'],
            'summary' => $validated['summary'] ?? '',
            'tags'    => $validated['tags'] ?? [],
        ]);

        return response()->json($this->serializePaper($paper));
    }

    public function destroy(ResearchPaper $paper)
    {
        if ($paper->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $paper->delete();

        return response()->json(['message' => 'Research paper deleted successfully']);
    }

    protected function serializePaper(object $paper): array
    {
        return [
            'id' => (string) $paper->id,
            'title' => $paper->title,
            'authors' => $paper->authors,
            'journal' => $paper->journal,
            'year' => $paper->year,
            'doi' => $paper->doi,
            'summary' => $paper->summary,
            'abstract' => $paper->summary,
            'tags' => $paper->tags ?? [],
        ];
    }
}
