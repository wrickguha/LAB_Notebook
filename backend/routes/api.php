<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalculatorHistoryController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotebookController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {

    // ── Authentication & Password Management (Rate Limited) ──
    Route::middleware('throttle:15,1')->group(function () {
        Route::post('/auth/signup', [AuthController::class, 'signup']);
        Route::post('/auth/signin', [AuthController::class, 'signin']);
        Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // ── User Profile & Preferences ──
    Route::put('/users/me', [UserController::class, 'updateCurrentUser']);

    // ── Dynamic Dashboard Summary ──
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    // ── Notifications ──
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markOneRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // ── Internal Lab Calendar ──
    Route::get('/calendar/events', [CalendarController::class, 'index']);
    Route::post('/calendar/events', [CalendarController::class, 'store']);
    Route::get('/calendar/events/{event}', [CalendarController::class, 'show']);
    Route::put('/calendar/events/{event}', [CalendarController::class, 'update']);
    Route::delete('/calendar/events/{event}', [CalendarController::class, 'destroy']);

    // ── Deterministic Daily Quote ──
    Route::get('/daily-quote', [QuoteController::class, 'show']);
    Route::post('/daily-quote/new', [QuoteController::class, 'newQuote']);

    // ── Research Projects & Tiptap Persistence ──
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    Route::post('/projects/{project}/save-content', [ProjectController::class, 'saveContent']);
    Route::patch('/projects/{project}/milestones/{milestone}', [ProjectController::class, 'toggleMilestone']);
    Route::post('/projects/{project}/share', [ProjectController::class, 'share']);
    Route::delete('/projects/{project}/share/{user}', [ProjectController::class, 'revokeAccess']);

    // ── Lab Notebooks & Tiptap Persistence ──
    Route::get('/notebook/folders', [NotebookController::class, 'listFolders']);
    Route::post('/notebook/folders', [NotebookController::class, 'createFolder']);
    Route::get('/notebook/entries', [NotebookController::class, 'index']);
    Route::get('/notebook/entries/{entry}', [NotebookController::class, 'show']);
    Route::post('/notebook/entries', [NotebookController::class, 'store']);
    Route::put('/notebook/entries/{entry}', [NotebookController::class, 'update']);
    Route::post('/notebook/entries/{entry}/auto-save', [NotebookController::class, 'autoSave']);
    Route::post('/notebook/entries/{entry}/sign', [NotebookController::class, 'sign']);
    Route::delete('/notebook/entries/{entry}', [NotebookController::class, 'destroy']);

    // ── Secure File Upload (<= 1MB, Whitelisted MIMEs) ──
    Route::post('/files/upload', [FileController::class, 'upload']);

    // ── Shared Resources & Papers ──
    Route::get('/resources', [ResourceController::class, 'index']);
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::patch('/resources/{resource}/permission', [ResourceController::class, 'updatePermission']);

    Route::get('/papers', [PaperController::class, 'index']);
    Route::post('/papers', [PaperController::class, 'store']);
    Route::delete('/papers/{paper}', [PaperController::class, 'destroy']);

    // ── Audit Logs & Calculator History ──
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::post('/audit-logs', [AuditLogController::class, 'store']);

    Route::get('/calculators/history', [CalculatorHistoryController::class, 'index']);
    Route::post('/calculators/history', [CalculatorHistoryController::class, 'store']);
});
