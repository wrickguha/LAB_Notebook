<?php

namespace App\Http\Controllers;

use App\Models\FileRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Strict 1 MB maximum upload with MIME and extension whitelisting.
     */
    public function upload(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Validate max 1024 KB (1 MB) and whitelisted mimes
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:1024', // 1024 KB = 1 MB limit
                'mimes:jpg,jpeg,png,webp,pdf',
                'mimetypes:image/jpeg,image/png,image/webp,application/pdf',
            ],
            'project_id'        => ['nullable', 'exists:projects,id'],
            'notebook_entry_id' => ['nullable', 'exists:notebook_entries,id'],
        ], [
            'file.max'   => 'The uploaded file exceeds the strict 1 MB size limit.',
            'file.mimes' => 'Only secure document (PDF) and image (JPG, PNG, WebP) formats are permitted.',
        ]);

        $file = $request->file('file');

        // Extra security: verify extension cannot be an executable disguised
        $dangerousExtensions = ['php', 'phtml', 'php5', 'php7', 'phar', 'exe', 'sh', 'bat', 'js', 'html', 'htm', 'cgi', 'pl'];
        $clientExtension = strtolower($file->getClientOriginalExtension());
        if (in_array($clientExtension, $dangerousExtensions)) {
            return response()->json(['message' => 'Dangerous file extension rejected.'], 422);
        }

        // Generate sanitized unique filename
        $safeExtension = $file->extension() ?: $clientExtension;
        $randomName = Str::random(32) . '.' . $safeExtension;
        $path = $file->storeAs('uploads/' . $userId, $randomName, 'public');

        $record = FileRecord::create([
            'user_id'           => $userId,
            'project_id'        => $request->input('project_id'),
            'notebook_entry_id' => $request->input('notebook_entry_id'),
            'filename'          => $randomName,
            'original_name'     => $file->getClientOriginalName(),
            'path'              => $path,
            'mime_type'         => $file->getMimeType() ?: 'application/octet-stream',
            'size_bytes'        => $file->getSize(),
        ]);

        $publicUrl = Storage::disk('public')->url($path);

        return response()->json([
            'id'           => (string) $record->id,
            'filename'     => $record->filename,
            'originalName' => $record->original_name,
            'url'          => $publicUrl,
            'mimeType'     => $record->mime_type,
            'sizeBytes'    => $record->size_bytes,
            'sizeFormatted'=> round($record->size_bytes / 1024, 1) . ' KB',
            'message'      => 'File uploaded successfully',
        ], 201);
    }
}
