<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query();

        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(action) LIKE ?', ['%' . $search . '%'])
                ->orWhereRaw('LOWER(target) LIKE ?', ['%' . $search . '%'])
                ->orWhereRaw('LOWER(user) LIKE ?', ['%' . $search . '%']);
            });
        }

        return response()->json(
            $query->orderByDesc('created_at')->get()->map(fn ($log) => $this->serializeLog($log))
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action' => ['required', 'string'],
            'target' => ['required', 'string'],
            'user' => ['nullable', 'string'],
            'ip' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'timestamp' => ['nullable', 'string'],
        ]);

        $log = AuditLog::create([
            'user' => $validated['user'] ?? (Auth::user()?->name ?? 'Dr. Evelyn Thorne'),
            'action' => $validated['action'],
            'target' => $validated['target'],
            'ip' => $validated['ip'] ?? '10.0.0.12',
            'status' => $validated['status'] ?? 'Verified',
            'timestamp' => $validated['timestamp'] ?? now()->toDateTimeString(),
        ]);

        return response()->json($this->serializeLog($log));
    }

    protected function serializeLog(AuditLog $log): array
    {
        return [
            'id' => (string) $log->id,
            'timestamp' => $log->timestamp,
            'user' => $log->user,
            'action' => $log->action,
            'target' => $log->target,
            'ip' => $log->ip,
            'status' => $log->status,
        ];
    }
}
