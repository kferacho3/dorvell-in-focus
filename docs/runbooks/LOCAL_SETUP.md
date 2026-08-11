# Runbook — Local setup

First-run procedure for a developer machine. Target time: under 15 minutes.

## 1. Prerequisites

| Tool | Version | Check |
| --- | --- | --- |
| Node.js | ≥ 20.9 (developed on 25.x) | `node -v` |
| pnpm | ≥ 10 | `pnpm -v` |
| PostgreSQL | 17 | `psql --version` |

### Installing PostgreSQL 17 (macOS / Homebrew)

```bash
brew install postgresql@17
brew services start postgresql@17

# Put the client tools on PATH for this shell (add to ~/.zshrc to persist):
export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"

pg_isready            # expect "accepting connections"
```

We use real PostgreSQL locally rather than SQLite because the publication
depends on Postgres-only capabilities: `tsvector` full-text search, `pg_trgm`
fuzzy matching, and Payload's Postgres migration files. A SQLite shortcut would
let schema drift ship to production undetected.

## 2. Create the database

```bash
createdb ferg_in_focus
```

The search layer needs two extensions. They are created by the first migration,
but you can verify them:

```bash
psql ferg_in_focus -c 'CREATE EXTENSION IF NOT EXISTS pg_trgm;'
psql ferg_in_focus -c 'CREATE EXTENSION IF NOT EXISTS unaccent;'
```

## 3. Environment

```bash
cp .env.example .env
```

Fill in, at minimum:

| Variable | Local value |
| --- | --- |
| `PAYLOAD_SECRET` | `openssl rand -base64 48` |
| `DATABASE_URI` | `postgres://localhost:5432/ferg_in_focus` |
| `PREVIEW_SECRET` | `openssl rand -hex 32` |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |

Leave `NEXT_PUBLIC_MEDIA_URL` blank locally — media then resolves against the
Next.js origin instead of CloudFront.

Leave every AWS and Mux variable blank locally. The S3 storage adapter and the
Mux provider both fall back to local-disk / direct-file behavior when their
credentials are absent, so no cloud access is required to develop.

> **Never** paste real AWS keys into `.env`. Production credentials are issued
> per-request by Vercel OIDC against an IAM role. If someone hands you a
> permanent access key, that is the bug — report it rather than using it.

## 4. Install and migrate

```bash
pnpm install
pnpm cms:migrate
```

## 5. Create the first admin user

Start the app and open the admin panel. Payload prompts to create the first
user when the `users` collection is empty.

```bash
pnpm dev
```

- Publication — <http://localhost:3000>
- Admin — <http://localhost:3000/admin>

Create **your own individual account**. Shared logins are prohibited; the audit
trail on rights overrides and publishing is only meaningful if each action maps
to one person.

## 6. Seed development content (optional)

```bash
pnpm cms:seed
```

Seeds the controlled taxonomy, channel settings, and a small set of real
reference records drawn from Dorvell's existing published material. The seed is
idempotent — it upserts on `legacySourceId` and never blind-creates.

## Verifying the setup

```bash
pnpm check      # lint + typecheck + unit tests + production build
```

Then confirm by hand:

1. `/` renders server-side. Disable JavaScript and reload — the page is still readable.
2. `/admin` loads and accepts your individual credentials.
3. A draft story can be created, previewed, and published.
4. An uploaded image lands under the configured storage path.

## Common problems

**`connection refused` on port 5432**
Postgres is not running: `brew services start postgresql@17`.

**`psql: command not found`**
The Homebrew keg is not on PATH. Re-run the `export PATH=...` line above.

**`relation "..." does not exist`**
Migrations have not been applied: `pnpm cms:migrate`. Check current state with
`pnpm cms:migrate:status`.

**Admin panel renders unstyled or throws about a missing import map**
Regenerate it: `pnpm cms:importmap`.

**Types out of date after a schema change**
`pnpm cms:types` rewrites `payload-types.ts`. Commit the result — CI verifies
that generated types match the schema.

## Resetting local state

Destructive, local only. Never run against a shared or production database.

```bash
dropdb ferg_in_focus && createdb ferg_in_focus && pnpm cms:migrate
```
