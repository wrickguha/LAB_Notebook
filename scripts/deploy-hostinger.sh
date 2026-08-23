#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${HOSTINGER_DEPLOY_PATH:?Set HOSTINGER_DEPLOY_PATH}"
PUBLIC_ROOT="${HOSTINGER_PUBLIC_PATH:?Set HOSTINGER_PUBLIC_PATH}"
API_ROOT="${HOSTINGER_API_PATH:?Set HOSTINGER_API_PATH}"

mkdir -p "$APP_ROOT" "$PUBLIC_ROOT" "$API_ROOT"

cd "$APP_ROOT"

if [ -f deploy.tar.gz ]; then
  tar -xzf deploy.tar.gz
  rm -rf backend frontend deploy.tar.gz
  mv deploy/backend ./backend
  mv deploy/frontend ./frontend
  rm -rf deploy
fi

rsync -a --delete "$APP_ROOT/frontend/" "$PUBLIC_ROOT/"
rsync -a --delete "$APP_ROOT/backend/" "$API_ROOT/"

cd "$API_ROOT"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link

chmod -R 775 storage bootstrap/cache
find "$API_ROOT" -type d -exec chmod 755 {} \;
find "$API_ROOT" -type f -exec chmod 644 {} \;

echo "Hostinger deployment complete."
