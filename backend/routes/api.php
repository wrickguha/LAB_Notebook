<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalculatorHistoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotebookController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::post('/auth/signup', [AuthController::class, 'signup']);
    Route::post('/auth/signin', [AuthController::class, 'signin']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::put('/users/me', [UserController::class, 'updateCurrentUser']);

    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markRead']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::patch('/projects/{project}/milestones/{milestone}', [ProjectController::class, 'toggleMilestone']);

    Route::get('/notebook/folders', [NotebookController::class, 'listFolders']);
    Route::post('/notebook/folders', [NotebookController::class, 'createFolder']);
    Route::get('/notebook/entries', [NotebookController::class, 'index']);
    Route::get('/notebook/entries/{entry}', [NotebookController::class, 'show']);
    Route::post('/notebook/entries', [NotebookController::class, 'store']);
    Route::put('/notebook/entries/{entry}', [NotebookController::class, 'update']);
    Route::post('/notebook/entries/{entry}/sign', [NotebookController::class, 'sign']);

    Route::get('/resources', [ResourceController::class, 'index']);
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::patch('/resources/{resource}/permission', [ResourceController::class, 'updatePermission']);

    Route::get('/papers', [PaperController::class, 'index']);
    Route::post('/papers', [PaperController::class, 'store']);

    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::post('/audit-logs', [AuditLogController::class, 'store']);

    Route::get('/calculators/history', [CalculatorHistoryController::class, 'index']);
    Route::post('/calculators/history', [CalculatorHistoryController::class, 'store']);
});
