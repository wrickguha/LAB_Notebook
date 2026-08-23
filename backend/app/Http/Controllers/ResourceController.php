<?php

namespace App\Http\Controllers;

use App\Models\SharedResource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index()
    {
        return response()->json(
            SharedResource::orderByDesc('updated_at')->get()->map(fn ($resource) => $this->serializeResource($resource))
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'type' => ['nullable', 'string'],
            'permission' => ['nullable', 'string'],
            'sharedWith' => ['nullable', 'array'],
        ]);

        $resource = SharedResource::create([
            'name' => $validated['name'],
            'type' => $validated['type'] ?? 'Folder',
            'owner' => 'Dr. Evelyn Thorne',
            'shared_with' => $validated['sharedWith'] ?? [],
            'last_modified' => now()->toDateString(),
        ]);

        return response()->json($this->serializeResource($resource));
    }

    public function updatePermission(Request $request, SharedResource $resource)
    {
        $validated = $request->validate([
            'targetUser' => ['required', 'string'],
            'newLevel' => ['required', 'string'],
        ]);

        $existing = $resource->shared_with ?? [];
        $updated = [];

        foreach ($existing as $entry) {
            $name = explode(' (', $entry)[0];
            $updated[] = $name === $validated['targetUser'] ? $validated['targetUser'] . ' (' . $validated['newLevel'] . ')' : $entry;
        }

        $resource->shared_with = $updated;
        $resource->last_modified = now()->toDateString();
        $resource->save();

        return response()->json($this->serializeResource($resource));
    }

    protected function serializeResource(SharedResource $resource): array
    {
        return [
            'id' => (string) $resource->id,
            'name' => $resource->name,
            'type' => $resource->type,
            'owner' => $resource->owner,
            'sharedWith' => $resource->shared_with ?? [],
            'lastModified' => $resource->last_modified,
        ];
    }
}
