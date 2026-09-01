<?php

/**
 * BioTech Post-Deployment Extractor & Artisan Runner
 *
 * Uploaded alongside frontend.zip and backend.zip to public_html/
 * Triggered by GitHub Actions via HTTP POST with Bearer token / X-Deploy-Token / Body Token.
 */

// ── Security & Headers ─────────────────────────────────────────────────────────
header('Content-Type: application/json');

$expectedToken = '__DEPLOY_SECRET__';

// Helper: Extract token from multiple potential channels (fixes web server header stripping)
function getReceivedToken(): string {
    // 1. Direct server environment variables
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!empty($authHeader) && preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        return trim($matches[1]);
    }

    // 2. Custom header X-Deploy-Token or X-Authorization (not stripped by LiteSpeed/Apache)
    if (!empty($_SERVER['HTTP_X_DEPLOY_TOKEN'])) {
        return trim($_SERVER['HTTP_X_DEPLOY_TOKEN']);
    }
    if (!empty($_SERVER['HTTP_X_AUTHORIZATION'])) {
        if (preg_match('/^Bearer\s+(.+)$/i', $_SERVER['HTTP_X_AUTHORIZATION'], $matches)) {
            return trim($matches[1]);
        }
        return trim($_SERVER['HTTP_X_AUTHORIZATION']);
    }

    // 3. getallheaders() or apache_request_headers() if available
    $headers = [];
    if (function_exists('getallheaders')) {
        $headers = (array) getallheaders();
    } elseif (function_exists('apache_request_headers')) {
        $headers = (array) apache_request_headers();
    }

    if (!empty($headers)) {
        $normalized = array_change_key_case($headers, CASE_LOWER);
        if (!empty($normalized['authorization']) && preg_match('/^Bearer\s+(.+)$/i', $normalized['authorization'], $matches)) {
            return trim($matches[1]);
        }
        if (!empty($normalized['x-deploy-token'])) {
            return trim($normalized['x-deploy-token']);
        }
        if (!empty($normalized['x-authorization'])) {
            if (preg_match('/^Bearer\s+(.+)$/i', $normalized['x-authorization'], $matches)) {
                return trim($matches[1]);
            }
            return trim($normalized['x-authorization']);
        }
    }

    // 4. POST body (JSON or Form URL encoded)
    if (!empty($_POST['token'])) {
        return trim((string) $_POST['token']);
    }
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $jsonData = json_decode($rawInput, true);
        if (is_array($jsonData) && !empty($jsonData['token'])) {
            return trim((string) $jsonData['token']);
        }
    }

    // 5. Query string fallback (?token=...)
    if (!empty($_GET['token'])) {
        return trim((string) $_GET['token']);
    }

    return '';
}

$receivedToken = getReceivedToken();

if (empty($expectedToken) || $expectedToken === '__DEPLOY_SECRET__' || empty($receivedToken) || !hash_equals($expectedToken, $receivedToken)) {
    http_response_code(403);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unauthorized: Invalid or missing bearer token',
        'details' => [
            'expected_configured' => (!empty($expectedToken) && $expectedToken !== '__DEPLOY_SECRET__'),
            'token_received'      => (!empty($receivedToken)),
        ],
    ]);
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
$parentDir     = dirname($domainDir);

// Detect Laravel directory: check domain level first, fallback to home directory
if (is_dir($domainDir . '/laravel')) {
    $laravelDir = $domainDir . '/laravel';
} elseif (is_dir($parentDir . '/laravel')) {
    $laravelDir = $parentDir . '/laravel';
} else {
    $laravelDir = $domainDir . '/laravel';
}

$apiDir = $publicHtmlDir . '/api';

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

    # Pass Authorization header to FastCGI/PHP
    <IfModule mod_setenvif.c>
        SetEnvIfNoCase ^Authorization$ "(.+)" HTTP_AUTHORIZATION=$1
    </IfModule>

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

// ── 4. Ensure Laravel Storage, Bootstrap & Environment ────────────────────────
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

// Ensure .env exists (copy from .env.example if missing)
if (!file_exists($laravelDir . '/.env') && file_exists($laravelDir . '/.env.example')) {
    @copy($laravelDir . '/.env.example', $laravelDir . '/.env');
    $report['steps']['env_file'] = 'copied_from_example';
}

// ── 5. Run Artisan Commands ───────────────────────────────────────────────────
// Resolve correct PHP CLI binary
$phpBin = 'php';
if (defined('PHP_BINARY') && !empty(PHP_BINARY) && file_exists(PHP_BINARY)) {
    // If PHP_BINARY is php-fpm or php-cgi, try CLI binary in same bin directory
    $phpDir = dirname(PHP_BINARY);
    if (file_exists($phpDir . '/php')) {
        $phpBin = $phpDir . '/php';
    } else {
        $phpBin = PHP_BINARY;
    }
}

$commands = [
    'storage:link' => "cd " . escapeshellarg($laravelDir) . " && " . escapeshellarg($phpBin) . " artisan storage:link 2>&1",
    'config:cache' => "cd " . escapeshellarg($laravelDir) . " && " . escapeshellarg($phpBin) . " artisan config:cache 2>&1",
    'route:cache'  => "cd " . escapeshellarg($laravelDir) . " && " . escapeshellarg($phpBin) . " artisan route:cache 2>&1",
    'view:cache'   => "cd " . escapeshellarg($laravelDir) . " && " . escapeshellarg($phpBin) . " artisan view:cache 2>&1",
    'migrate'      => "cd " . escapeshellarg($laravelDir) . " && " . escapeshellarg($phpBin) . " artisan migrate --force 2>&1",
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

// Self-cleanup: remove deploy-runner.php from public_html after successful execution
@unlink(__FILE__);
$report['steps']['cleanup_runner'] = 'success';

// Return final report
echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
