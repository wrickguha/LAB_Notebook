<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::where('user_id', Auth::id());

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
        ]);

        $log = AuditLog::create([
            'user_id' => Auth::id(),
            'user' => Auth::user()->name,
            'action' => $validated['action'],
            'target' => $validated['target'],
            'ip' => $request->ip(),
            'status' => 'Verified',
            'timestamp' => now()->toDateTimeString(),
        ]);

        return response()->json($this->serializeLog($log));
    }

    protected function serializeLog(object $log): array
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
