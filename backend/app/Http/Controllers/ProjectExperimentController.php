<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectExperiment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProjectExperimentController extends Controller
{
    public function index(Project $project)
    {
        if (! Gate::forUser(Auth::user())->allows('view', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            $project->experiments()
                ->orderBy('sequence')
                ->get()
                ->map(fn (ProjectExperiment $experiment) => $this->serialize($experiment))
                ->values()
        );
    }

    public function store(Request $request, Project $project)
    {
        if (! Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'objective' => ['nullable', 'string', 'max:10000'],
            'date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:10000'],
        ]);

        $experiment = DB::transaction(function () use ($project, $validated) {
            $lockedProject = Project::query()->lockForUpdate()->findOrFail($project->id);
            $sequence = (int) $lockedProject->experiments()->max('sequence') + 1;

            $experiment = $lockedProject->experiments()->create([
                'created_by' => Auth::id(),
                'sequence' => $sequence,
                'name' => trim($validated['name']),
                'objective' => array_key_exists('objective', $validated) ? $validated['objective'] : null,
                'experiment_date' => $validated['date'] ?? now()->toDateString(),
                'notes' => $validated['notes'] ?? null,
            ]);

            $lockedProject->forceFill(['last_activity' => now()])->save();

            return $experiment;
        });

        return response()->json($this->serialize($experiment), 201);
    }

    public function update(Request $request, Project $project, ProjectExperiment $experiment)
    {
        if (! Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($experiment->project_id !== $project->id) {
            return response()->json(['message' => 'Experiment not found for project'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'objective' => ['sometimes', 'nullable', 'string', 'max:10000'],
            'date' => ['sometimes', 'nullable', 'date'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:10000'],
            'completed' => ['sometimes', 'boolean'],
        ]);

        $experiment->fill([
            'name' => array_key_exists('name', $validated) ? trim($validated['name']) : $experiment->name,
            'objective' => array_key_exists('objective', $validated) ? $validated['objective'] : $experiment->objective,
            'experiment_date' => array_key_exists('date', $validated) ? $validated['date'] : $experiment->experiment_date,
            'notes' => array_key_exists('notes', $validated) ? $validated['notes'] : $experiment->notes,
            'completed' => $validated['completed'] ?? $experiment->completed,
        ])->save();

        $project->forceFill(['last_activity' => now()])->save();

        return response()->json($this->serialize($experiment));
    }

    public function destroy(Project $project, ProjectExperiment $experiment)
    {
        if (! Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($experiment->project_id !== $project->id) {
            return response()->json(['message' => 'Experiment not found for project'], 404);
        }

        $experiment->delete();
        $project->forceFill(['last_activity' => now()])->save();

        return response()->json(['message' => 'Experiment deleted successfully']);
    }

    private function serialize(ProjectExperiment $experiment): array
    {
        return [
            'id' => (string) $experiment->id,
            'expId' => 'EXP-'.str_pad((string) $experiment->sequence, 3, '0', STR_PAD_LEFT),
            'name' => $experiment->name,
            'objective' => $experiment->objective ?? '',
            'date' => $experiment->experiment_date?->format('Y-m-d'),
            'notes' => $experiment->notes ?? '',
            'completed' => (bool) $experiment->completed,
        ];
    }
}
