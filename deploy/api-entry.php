<?php

define('LARAVEL_START', microtime(true));

// __LARAVEL_PATH__ is replaced by the deploy workflow with the absolute server path
if (file_exists($maintenance = '__LARAVEL_PATH__/storage/framework/maintenance.php')) {
    require $maintenance;
}

require '__LARAVEL_PATH__/vendor/autoload.php';

$app = require_once '__LARAVEL_PATH__/bootstrap/app.php';

$app->handleRequest(Illuminate\Http\Request::capture());
