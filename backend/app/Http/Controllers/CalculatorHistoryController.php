<?php

namespace App\Http\Controllers;

use App\Models\CalculatorHistory;
use Illuminate\Http\Request;

class CalculatorHistoryController extends Controller
{
    public function index()
    {
        return response()->json(
            CalculatorHistory::orderByDesc('created_at')->get()->map(fn ($item) => $this->serializeHistory($item))
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'string'],
            'calculator_name' => ['nullable', 'string'],
            'formula' => ['nullable', 'string'],
            'input' => ['nullable', 'string'],
            'result' => ['nullable', 'string'],
            'input_json' => ['nullable', 'array'],
            'output_json' => ['nullable', 'array'],
            'project_id' => ['nullable', 'string'],
        ]);

        $item = CalculatorHistory::create([
            'type' => $validated['type'],
            'calculator_name' => $validated['calculator_name'] ?? $validated['type'],
            'formula' => $validated['formula'] ?? '',
            'input' => $validated['input'] ?? '',
            'result' => $validated['result'] ?? '',
            'input_json' => $validated['input_json'] ?? [],
            'output_json' => $validated['output_json'] ?? [],
            'project_id' => $validated['project_id'] ?? null,
        ]);

        return response()->json($this->serializeHistory($item));
    }

    protected function serializeHistory(CalculatorHistory $item): array
    {
        return [
            'id' => (string) $item->id,
            'type' => $item->type,
            'calculator_name' => $item->calculator_name,
            'formula' => $item->formula,
            'input' => $item->input,
            'result' => $item->result,
            'input_json' => $item->input_json ?? [],
            'output_json' => $item->output_json ?? [],
            'project_id' => $item->project_id,
        ];
    }
}
