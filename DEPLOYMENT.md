# Hostinger Deployment Setup

This project is structured as:

- Frontend: React + Vite app in `frontend/`
- Backend: Laravel API in `backend/`

The recommended deployment layout on Hostinger is:

- Frontend (domain root): `public_html/`
- Laravel API: `api.example.com/public_html` or another backend subdomain directory

## 1) GitHub repository setup

1. Push this repo to GitHub.
2. In GitHub, go to Settings > Secrets and variables > Actions.
3. Add the following secrets:

   - `HOSTINGER_SSH_HOST`
   - `HOSTINGER_SSH_USER`
   - `HOSTINGER_SSH_PORT` (usually `22`)
   - `HOSTINGER_SSH_KEY` (raw private SSH key content, including `-----BEGIN OPENSSH PRIVATE KEY-----`)
   - `HOSTINGER_SSH_PASSPHRASE` (optional, only if your private key is encrypted)
   - `HOSTINGER_DEPLOY_PATH` (temporary staging folder on server, example: `/home/username/deploy/biotech`)
   - `HOSTINGER_PUBLIC_PATH` (frontend root path, example: `/home/username/public_html`)
   - `HOSTINGER_API_PATH` (Laravel path, example: `/home/username/domains/api.example.com/public_html`)
   - `APP_NAME`
   - `APP_KEY` (Laravel app key)
   - `APP_URL` (e.g. `https://api.example.com`)
   - `VITE_API_URL` (e.g. `https://api.example.com`)
   - `DB_HOST`
   - `DB_PORT` (usually `3306`)
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `MAIL_FROM_ADDRESS`

## 2) Hostinger server setup

1. Create a subdomain or domain for the API (for example: `api.example.com`).
2. Point it to the server folder that will hold the Laravel app.
3. Generate an SSH key and add the public key to Hostinger.
4. If you protect the private key with a passphrase, add the passphrase to the GitHub Actions secret `HOSTINGER_SSH_PASSPHRASE`.
5. Ensure PHP 8.2 + Composer + MySQL are available on the server.
6. Make sure the web root is the folder that serves the frontend static build.

## 3) Production environment values

In `backend/.env`, use your Hostinger MySQL connection:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.example.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lab_notebook
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
```

For the frontend, set:

```env
VITE_API_URL=https://api.example.com
```

## 4) GitHub Actions deployment

Every push to the `main` branch triggers the workflow at:

- `.github/workflows/deploy.yml`

It will:

1. Install frontend dependencies.
2. Build the production React app.
3. Install Laravel dependencies.
4. Run production Laravel cache and migration steps.
5. Upload the build to Hostinger.
6. Deploy the files and run Laravel maintenance tasks.

## 5) Important notes

- Keep the app key safe and never commit production secrets.
- Run database migrations only after confirming the new schema is compatible.
- If your Hostinger plan does not support Node.js on the server, the frontend should remain static and be built in GitHub Actions before deployment.
- If you use a custom server path or root location, adjust the `HOSTINGER_PUBLIC_PATH` and `HOSTINGER_API_PATH` secrets accordingly.

## 6) Useful commands for remote debug

```bash
cd /path/to/laravel-app
php artisan migrate
php artisan config:clear
php artisan route:list
php artisan storage:link
```

If you want a simpler setup, you can also deploy the Laravel backend to a subdomain and keep the React front end on the main domain root.
