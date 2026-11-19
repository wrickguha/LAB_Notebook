<?php

namespace App\Http\Controllers;

use App\Models\FileRecord;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => $this->fileRules(),
            'project_id' => ['nullable', 'exists:projects,id'],
            'notebook_entry_id' => ['nullable', 'exists:notebook_entries,id'],
        ], [
            'file.max' => 'The uploaded file exceeds the strict 1 MB size limit.',
            'file.mimes' => 'Only PDF, CSV, Excel, JPG, PNG, GIF, and WebP files are permitted.',
        ]);

        if (! empty($validated['project_id'])) {
            $project = Project::findOrFail($validated['project_id']);
            if (! Gate::forUser(Auth::user())->allows('update', $project)) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $record = $this->storeRecord(
            $validated['file'],
            'public',
            $validated['project_id'] ?? null,
            $validated['notebook_entry_id'] ?? null
        );

        return response()->json($this->serializeFile($record, false) + [
            'message' => 'File uploaded successfully',
        ], 201);
    }

    public function indexForProject(Project $project)
    {
        if (! Gate::forUser(Auth::user())->allows('view', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            $project->files()
                ->with('user')
                ->latest()
                ->get()
                ->map(fn (FileRecord $file) => $this->serializeFile($file))
                ->values()
        );
    }

    public function uploadToProject(Request $request, Project $project)
    {
        if (! Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'file' => $this->fileRules(),
        ], [
            'file.max' => 'The uploaded file exceeds the strict 1 MB size limit.',
            'file.mimes' => 'Only PDF, CSV, Excel, JPG, PNG, GIF, and WebP files are permitted.',
        ]);

        $file = $this->storeRecord($validated['file'], 'local', $project->id);

        $project->forceFill(['last_activity' => now()])->save();

        return response()->json($this->serializeFile($file), 201);
    }

    public function downloadFromProject(Project $project, FileRecord $file)
    {
        if (! Gate::forUser(Auth::user())->allows('view', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($file->project_id !== $project->id) {
            return response()->json(['message' => 'File not found for project'], 404);
        }

        $disk = $file->storage_disk ?: 'public';
        if (! Storage::disk($disk)->exists($file->path)) {
            return response()->json(['message' => 'The stored file is no longer available.'], 404);
        }

        return Storage::disk($disk)->download($file->path, $file->original_name);
    }

    public function destroyFromProject(Project $project, FileRecord $file)
    {
        if (! Gate::forUser(Auth::user())->allows('update', $project)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($file->project_id !== $project->id) {
            return response()->json(['message' => 'File not found for project'], 404);
        }

        $disk = Storage::disk($file->storage_disk ?: 'public');
        if ($disk->exists($file->path) && ! $disk->delete($file->path)) {
            throw new \RuntimeException('Unable to delete the stored project file.');
        }
        $file->delete();
        $project->forceFill(['last_activity' => now()])->save();

        return response()->json(['message' => 'File deleted successfully']);
    }

    private function fileRules(): array
    {
        return [
            'required',
            'file',
            'max:1024',
            'mimes:jpg,jpeg,png,gif,webp,pdf,csv,xls,xlsx',
            'extensions:jpg,jpeg,png,gif,webp,pdf,csv,xls,xlsx',
            'mimetypes:image/jpeg,image/png,image/gif,image/webp,application/pdf,text/csv,text/plain,application/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
    }

    private function storeRecord(UploadedFile $file, string $disk, ?int $projectId = null, ?int $notebookEntryId = null): FileRecord
    {
        $extension = $file->extension();
        $filename = Str::random(40).'.'.$extension;
        $directory = $disk === 'local'
            ? 'project-files/'.$projectId.'/'.Auth::id()
            : 'uploads/'.Auth::id();
        $path = $file->storeAs($directory, $filename, $disk);
        if (! $path) {
            throw new \RuntimeException('Unable to store the uploaded file.');
        }

        return FileRecord::create([
            'user_id' => Auth::id(),
            'project_id' => $projectId,
            'notebook_entry_id' => $notebookEntryId,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
            'size_bytes' => $file->getSize(),
            'storage_disk' => $disk,
        ])->load('user');
    }

    private function serializeFile(FileRecord $file, bool $projectDownload = true): array
    {
        $url = $file->project_id && $projectDownload
            ? "/api/projects/{$file->project_id}/files/{$file->id}/download"
            : Storage::disk($file->storage_disk ?: 'public')->url($file->path);

        return [
            'id' => (string) $file->id,
            'filename' => $file->filename,
            'name' => $file->original_name,
            'originalName' => $file->original_name,
            'url' => $url,
            'mimeType' => $file->mime_type,
            'sizeBytes' => (int) $file->size_bytes,
            'sizeFormatted' => round($file->size_bytes / 1024, 1).' KB',
            'uploadedBy' => $file->user?->name ?? 'Researcher',
            'date' => $file->created_at?->toISOString(),
        ];
    }
}
