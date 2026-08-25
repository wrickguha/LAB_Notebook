<?php

/**
 * BioTech Post-Deployment Extractor & Artisan Runner
 *
 * Uploaded alongside frontend.zip and backend.zip to public_html/
 * Triggered by GitHub Actions via HTTP POST with Bearer token.
 */

// ── Security & Headers ─────────────────────────────────────────────────────────
header('Content-Type: application/json');

$expectedToken = '__DEPLOY_SECRET__';

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}

if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches) || !hash_equals($expectedToken, trim($matches[1]))) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized: Invalid or missing bearer token']);
    exit(1);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit(1);
}

// ── Paths ──────────────────────────────────────────────────────────────────────
$publicHtmlDir = __DIR__;
$domainDir     = dirname($publicHtmlDir);
$laravelDir    = $domainDir . '/laravel';
$apiDir        = $publicHtmlDir . '/api';

$report = [
    'status'     => 'ok',
    'timestamp'  => date('Y-m-d H:i:s T'),
    'paths'      => [
        'public_html' => $publicHtmlDir,
        'laravel'     => $laravelDir,
        'api'         => $apiDir,
    ],
    'steps'      => [],
];

// Helper: Zip extractor with fallback to exec('unzip')
function extractZip(string $zipPath, string $destDir): array {
    if (!file_exists($zipPath)) {
        return ['status' => 'skipped', 'message' => "Zip file not found: $zipPath"];
    }

    if (!is_dir($destDir)) {
        mkdir($destDir, 0755, true);
    }

    if (class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($zipPath) === true) {
            $zip->extractTo($destDir);
            $numFiles = $zip->numFiles;
            $zip->close();
            @unlink($zipPath);
            return ['status' => 'success', 'files_extracted' => $numFiles, 'method' => 'ZipArchive'];
        }
    }

    // Fallback to system unzip command
    $output = [];
    $exitCode = 0;
    exec("unzip -o -q " . escapeshellarg($zipPath) . " -d " . escapeshellarg($destDir) . " 2>&1", $output, $exitCode);
    @unlink($zipPath);

    return [
        'status'    => ($exitCode === 0) ? 'success' : 'error',
        'exit_code' => $exitCode,
        'output'    => implode("\n", $output),
        'method'    => 'cli_unzip',
    ];
}

// ── 1. Extract Frontend ───────────────────────────────────────────────────────
$frontendZip = $publicHtmlDir . '/frontend.zip';
$report['steps']['extract_frontend'] = extractZip($frontendZip, $publicHtmlDir);

// ── 2. Extract Backend ────────────────────────────────────────────────────────
$backendZip = $publicHtmlDir . '/backend.zip';
$report['steps']['extract_backend'] = extractZip($backendZip, $laravelDir);

// ── 3. Setup API Directory & Entry Point ──────────────────────────────────────
if (!is_dir($apiDir)) {
    mkdir($apiDir, 0755, true);
}

// Write public_html/api/index.php
$apiEntryCode = <<<'PHP'
<?php

define('LARAVEL_START', microtime(true));

$laravelPath = dirname(__DIR__, 2) . '/laravel';
if (!is_dir($laravelPath)) {
    $laravelPath = dirname(__DIR__) . '/laravel';
}

if (file_exists($maintenance = $laravelPath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $laravelPath . '/vendor/autoload.php';

$app = require_once $laravelPath . '/bootstrap/app.php';

$app->handleRequest(Illuminate\Http\Request::capture());
PHP;

file_put_contents($apiDir . '/index.php', $apiEntryCode);
$report['steps']['write_api_entry'] = 'success';

// Write public_html/api/.htaccess for Laravel API subfolder routing
$apiHtaccess = <<<'HTACCESS'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
HTACCESS;

file_put_contents($apiDir . '/.htaccess', $apiHtaccess);
$report['steps']['write_api_htaccess'] = 'success';

// ── 4. Ensure Laravel Storage & Bootstrap Directories ─────────────────────────
$requiredDirs = [
    'storage/app/public',
    'storage/framework/cache/data',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
];

foreach ($requiredDirs as $dir) {
    $full = $laravelDir . '/' . $dir;
    if (!is_dir($full)) {
        @mkdir($full, 0775, true);
    }
}
$report['steps']['storage_dirs'] = 'created';

// ── 5. Run Artisan Commands ───────────────────────────────────────────────────
$commands = [
    'storage:link' => "cd " . escapeshellarg($laravelDir) . " && php artisan storage:link 2>&1",
    'config:cache' => "cd " . escapeshellarg($laravelDir) . " && php artisan config:cache 2>&1",
    'route:cache'  => "cd " . escapeshellarg($laravelDir) . " && php artisan route:cache 2>&1",
    'view:cache'   => "cd " . escapeshellarg($laravelDir) . " && php artisan view:cache 2>&1",
    'migrate'      => "cd " . escapeshellarg($laravelDir) . " && php artisan migrate --force 2>&1",
    'permissions'  => "cd " . escapeshellarg($laravelDir) . " && chmod -R 775 storage bootstrap/cache 2>&1",
];

$artisanResults = [];
foreach ($commands as $label => $cmd) {
    $cmdOut = [];
    $code   = 0;
    exec($cmd, $cmdOut, $code);
    $artisanResults[$label] = [
        'exit_code' => $code,
        'output'    => implode("\n", $cmdOut),
    ];
}
$report['steps']['artisan_commands'] = $artisanResults;

// Return final report
echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
