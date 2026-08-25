<?php

/**
 * Post-Deployment Webhook
 *
 * Triggered by the GitHub Actions workflow after FTP upload completes.
 * Runs Laravel artisan commands that previously ran via SSH.
 *
 * Security: Requires a Bearer token matching DEPLOY_WEBHOOK_SECRET.
 * This file is uploaded to public_html/api/deploy-hook.php by the workflow.
 */

// ── Configuration ──────────────────────────────────────────────────────────────
// __DEPLOY_SECRET__ and __LARAVEL_PATH__ are replaced by sed during deployment.
$expectedToken = '__DEPLOY_SECRET__';
$laravelPath   = '__LARAVEL_PATH__';

// ── Auth check ─────────────────────────────────────────────────────────────────
header('Content-Type: application/json');

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches) || !hash_equals($expectedToken, trim($matches[1]))) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit(1);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit(1);
}

// ── Run artisan commands ───────────────────────────────────────────────────────
$results = [];

// Ensure required directories exist
$dirs = [
    'storage/app/public',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
];
foreach ($dirs as $dir) {
    $full = "$laravelPath/$dir";
    if (!is_dir($full)) {
        mkdir($full, 0775, true);
    }
}
$results['directories'] = 'created';

// Commands to run in order
$commands = [
    'config:cache'   => "cd '$laravelPath' && php artisan config:cache 2>&1",
    'route:cache'    => "cd '$laravelPath' && php artisan route:cache 2>&1",
    'view:cache'     => "cd '$laravelPath' && php artisan view:cache 2>&1",
    'migrate'        => "cd '$laravelPath' && php artisan migrate --force 2>&1",
    'storage:link'   => "cd '$laravelPath' && [ -L public/storage ] || php artisan storage:link 2>&1",
    'permissions'    => "cd '$laravelPath' && chmod -R 775 storage bootstrap/cache 2>&1",
];

foreach ($commands as $label => $cmd) {
    $output = [];
    $code   = 0;
    exec($cmd, $output, $code);
    $results[$label] = [
        'exit_code' => $code,
        'output'    => implode("\n", $output),
    ];
}

http_response_code(200);
echo json_encode([
    'status'  => 'ok',
    'results' => $results,
], JSON_PRETTY_PRINT);
