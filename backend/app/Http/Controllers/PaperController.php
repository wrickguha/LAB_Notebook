<?php

namespace App\Http\Controllers;

use App\Models\ResearchPaper;
use Illuminate\Http\Request;

class PaperController extends Controller
{
    public function index()
    {
        return response()->json(
            ResearchPaper::orderByDesc('created_at')->get()->map(fn ($paper) => $this->serializePaper($paper))
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

    protected function serializePaper(ResearchPaper $paper): array
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
