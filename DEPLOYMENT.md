# Deployment Guide — BioTech (inveniqlab.com)

## Architecture

```
LOCAL DEV
    │
    │  git push origin main
    ▼
GITHUB
    │
    │  GitHub Actions (.github/workflows/deploy.yml)
    │  • npm ci + npm run build  (React/Vite)
    │  • rsync frontend/dist  →  public_html/
    │  • rsync backend/       →  ~/laravel/
    │  • composer install on server
    │  • php artisan migrate/cache/link
    ▼
HOSTINGER SERVER
    │
    ├── public_html/          ← document root (https://inveniqlab.com)
    │   ├── index.html        ← React SPA
    │   ├── assets/
    │   ├── .htaccess         ← HTTPS redirect + SPA routing
    │   └── api/
    │       ├── .htaccess     ← Laravel rewrite rules
    │       └── index.php     ← Laravel entry (absolute path to ~/laravel)
    │
    └── laravel/              ← NOT web-accessible
        ├── app/
        ├── bootstrap/
        ├── config/
        ├── database/
        ├── resources/
        ├── routes/
        ├── storage/
        ├── vendor/
        └── .env              ← production secrets (never committed)
```

API routing: `https://inveniqlab.com/api/*` → `public_html/api/index.php` → `~/laravel`  
SPA routing: all other paths → `public_html/index.html`

---

## Repository Structure

```
.
├── .github/workflows/deploy.yml   GitHub Actions CI/CD
├── .gitignore
├── backend/                       Laravel 12 (PHP 8.2+)
├── deploy/api-entry.php           Laravel entry-point template
├── frontend/                      React 19 / Vite 8
├── scripts/deploy-hostinger.sh    Manual deployment helper
└── DEPLOYMENT.md                  This file
```

---

## Local Development Setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set APP_KEY, DB_*, etc.
php artisan key:generate
php artisan migrate
php artisan serve
# → http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:8000
npm install
npm run dev
# → http://localhost:5173
```

---

## Environment Variables

### Frontend (`frontend/.env.local` — not committed)

| Variable | Dev value | Production value |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | `https://inveniqlab.com/api` |

Production value is injected at build time by the `VITE_API_URL` GitHub secret.

### Backend (`backend/.env` — never committed)

Key production values:

```dotenv
APP_NAME="BioTech"
APP_ENV=production
APP_KEY=base64:...              # generate once; keep stable
APP_DEBUG=false
APP_URL=https://inveniqlab.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SESSION_DRIVER=database
SESSION_DOMAIN=inveniqlab.com

CORS_ALLOWED_ORIGIN=https://inveniqlab.com

LOG_CHANNEL=stack
LOG_LEVEL=error
```

---

## GitHub Secrets Required

Set these in **GitHub → Settings → Secrets → Actions**:

| Secret | Description |
|---|---|
| `HOSTINGER_SSH_KEY` | Private SSH key (paste contents of `~/.ssh/id_rsa`) |
| `HOSTINGER_SSH_HOST` | Hostinger SSH hostname (e.g. `srv123.hostinger.com`) |
| `HOSTINGER_SSH_USER` | SSH username (e.g. `u123456789`) |
| `HOSTINGER_SSH_PORT` | SSH port — Hostinger uses `65002` by default |
| `HOSTINGER_PUBLIC_PATH` | Absolute path to public_html (e.g. `/home/u123456789/public_html`) |
| `HOSTINGER_LARAVEL_PATH` | Absolute path for Laravel (e.g. `/home/u123456789/laravel`) |
| `VITE_API_URL` | `https://inveniqlab.com/api` |

---

## First Deployment (One-Time Setup)

### 1. Hostinger — Domain & SSL

1. Log into **hPanel → Websites → Manage**
2. Ensure domain `inveniqlab.com` points to the hosting account
3. Enable **Force HTTPS** under hPanel → SSL → Manage

### 2. Hostinger — MySQL Database

1. hPanel → **Databases → MySQL Databases**
2. Create a database, user, and strong password
3. Note the `DB_HOST` shown (usually `127.0.0.1` for shared hosting)

### 3. Hostinger — SSH Key

```bash
# On your local machine (if you don't have a key)
ssh-keygen -t ed25519 -C "deploy@inveniqlab.com"

# Copy the public key to Hostinger hPanel → SSH Access → Add SSH Key
cat ~/.ssh/id_ed25519.pub

# Paste the private key into the HOSTINGER_SSH_KEY GitHub secret
cat ~/.ssh/id_ed25519
```

### 4. Hostinger — Create the Laravel directory

```bash
ssh -p 65002 u123456789@srv123.hostinger.com
mkdir -p ~/laravel
```

### 5. Hostinger — Create the production `.env`

SSH into the server and create `~/laravel/.env` with production values:

```bash
nano ~/laravel/.env
```

Minimum required content (see [Environment Variables](#environment-variables) above for all keys).  
Run `php artisan key:generate --show` locally to get a key value, then paste it as `APP_KEY`.

**Never commit this file. It contains your database password.**

### 6. Hostinger — PHP version

In hPanel → **PHP Configuration**, set PHP to **8.2** or newer.

### 7. GitHub Actions — Add secrets

Add all secrets listed in [GitHub Secrets Required](#github-secrets-required).

### 8. Trigger the first deployment

```bash
git push origin main
```

The Actions workflow will:
- Build the React bundle
- rsync frontend → `public_html/`
- rsync backend → `~/laravel/`
- Generate `public_html/api/index.php`
- Run `composer install` on the server
- Run `php artisan config:cache`, `route:cache`, `view:cache`
- Run `php artisan migrate --force`
- Run `php artisan storage:link`
- Fix directory permissions

### 9. Verify

- `https://inveniqlab.com/` — React app loads
- `https://inveniqlab.com/api/up` — Laravel health check returns `200`
- Browser refresh on a React route (e.g. `/dashboard`) returns the app, not 404

---

## Normal Development Workflow (after first deployment)

```bash
# Make changes locally, test, then:
git add .
git commit -m "Describe change"
git push origin main
# GitHub Actions deploys automatically (~2-3 minutes)
```

---

## Rollback

### Quick rollback via git

```bash
# Find the last working commit hash
git log --oneline -10

# Revert to a specific commit
git revert <bad-commit-hash>   # creates a new revert commit — safe for shared branches
git push origin main
# GitHub Actions redeploys the reverted code
```

### Emergency rollback via SSH

```bash
ssh -p 65002 u123456789@srv123.hostinger.com
cd ~/laravel

# Re-check out a previous version if the repo is cloned on the server, OR
# manually restore from a backup, then:
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Never run `php artisan migrate:fresh` or `php artisan db:wipe` on production.**

---

## Database Migrations

Migrations run automatically during each deployment (`php artisan migrate --force`).

Safe practices:
- Write additive migrations (add columns, add tables)
- Never drop columns in the same migration that renames them
- For destructive changes: deploy in two steps (add → deprecate → remove in a later release)

---

## Logs

```bash
# Via SSH
ssh -p 65002 u123456789@srv123.hostinger.com
tail -n 100 ~/laravel/storage/logs/laravel.log
```

Or via **hPanel → File Manager** → navigate to `laravel/storage/logs/laravel.log`.

Logs are outside `public_html` and are not publicly accessible.

---

## Cron Jobs (Laravel Scheduler)

No scheduled commands are defined yet (`routes/console.php` is empty).

If you add scheduled tasks, configure this cron in **hPanel → Cron Jobs**:

```
* * * * * /usr/local/bin/php /home/u123456789/laravel/artisan schedule:run >> /dev/null 2>&1
```

Find the correct PHP binary path with: `which php` over SSH.

---

## Queue Workers

The app uses `QUEUE_CONNECTION=database`. Hostinger shared hosting does not support persistent Supervisor workers.

Options:
- Run `php artisan queue:work --once` from a cron job every minute (low throughput, sufficient for small apps)
- Upgrade to Hostinger Cloud/VPS for Supervisor support

---

## Security Checklist

- [ ] `APP_DEBUG=false` in production `.env`
- [ ] `APP_ENV=production` in production `.env`
- [ ] `backend/.env` is never committed (covered by `.gitignore`)
- [ ] `CORS_ALLOWED_ORIGIN=https://inveniqlab.com` in production `.env`
- [ ] Force HTTPS enabled in hPanel
- [ ] Directory listing disabled (`Options -Indexes` in `.htaccess`)
- [ ] `public_html/api/` only exposes `index.php` and `.htaccess`
- [ ] `~/laravel/` is outside `public_html`
- [ ] Database credentials are only in the server-side `.env`
- [ ] SSH key has no passphrase (deploy key); restrict its permissions in Hostinger if possible
- [ ] GitHub secrets are set to **repository** scope, not organization-wide

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `403 Forbidden` on `/api/*` | `api/index.php` missing or wrong path | Re-run the workflow; verify `HOSTINGER_LARAVEL_PATH` secret |
| `500` on all API calls | Laravel `.env` missing or misconfigured | SSH in and check `~/laravel/storage/logs/laravel.log` |
| React routes return `404` on refresh | `.htaccess` not in `public_html/` | Check `frontend/dist/.htaccess` was copied during build |
| CORS error in browser | `CORS_ALLOWED_ORIGIN` not set | Add to `~/laravel/.env`, run `php artisan config:cache` |
| Session not persisting | `SESSION_DOMAIN` mismatch | Set `SESSION_DOMAIN=inveniqlab.com` in `~/laravel/.env` |
| `composer: command not found` | Hostinger plan doesn't have Composer in PATH | Use full path: `/usr/local/bin/composer` |
