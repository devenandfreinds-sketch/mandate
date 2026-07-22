# Deploying Mandate to Railway

Mandate deploys as **three Railway resources** in one project:

1. **Postgres** — Railway's managed Postgres plugin
2. **mandate-server** — the Express + Prisma API
3. **mandate-client** — the built React app, served as static files

The client and server are independent services with independent public URLs; the client talks to the server over HTTP, not via a shared process. This is why `npm run dev` (the Vite *dev* server) must never be the client's start command in production — it's a development-only tool that isn't meant to serve real traffic, doesn't bind correctly for Railway's networking, and defeats the whole point of a production build.

## Prerequisite: Root Directory = repository root, for BOTH services

This is the most common way this misconfiguration happens, so it's worth stating explicitly: **do not** set a service's "Root Directory" to `client/` or `server/` in the Railway dashboard. Leave it as the repository root for both services.

Why: this is an npm-workspaces monorepo. `client/package.json` and `server/package.json` both depend on `@mandate/shared` via the workspace protocol (`"@mandate/shared": "*"`), which only resolves correctly when `npm install` runs at the repo root (it hoists a symlink into the root `node_modules`). If Railway's install step runs inside `client/` or `server/` directly, that dependency can't resolve and the build fails. Instead, keep Root Directory at the repo root and point each service's Build/Start Command at the right workspace using the `-w` flag (already set up below).

## Service 1 — Postgres

Add Railway's **Postgres** plugin to the project. It automatically injects a `DATABASE_URL` variable into any other service in the same project that references it (see below) — no manual connection string needed.

## Service 2 — mandate-server

**Root Directory:** `/` (repo root)

**Build Command:**
```
npm run build:server
```
This runs `npm run build -w shared && npm run build -w server`, which compiles the shared types package, generates the Prisma Client (`prisma generate` is chained into the server's own `build` script), and compiles the server's TypeScript.

**Start Command:**
```
npm run start:server
```
This runs `prisma migrate deploy` (applies any pending migrations against the production database) and then starts the compiled server (`node dist/index.js`), which listens on `process.env.PORT` bound to `0.0.0.0` — required for Railway's networking to reach it.

**Environment variables** (Service → Variables):

| Variable | Value | Notes |
| --- | --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Reference the Postgres plugin's variable — Railway autocompletes this. |
| `NODE_ENV` | `production` | Enables secure cookies, cross-origin cookie mode, and hides stack traces. |
| `SESSION_SECRET` | a long random string | Generate one locally: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `ADMIN_PASSWORD_HASH` | a bcrypt hash | Generate locally with `npm run admin:set-password -w server -- <password>`, then copy the `ADMIN_PASSWORD_HASH` value out of the `server/.env` it writes — don't reuse the `SESSION_SECRET` it also generates unless you want the same one as above. |
| `CLIENT_URL` | the client service's public URL (see below) | Restricts CORS and lets the admin session cookie be scoped correctly. Set this *after* the client service has a public domain (step below), then redeploy. |

`PORT` is injected automatically by Railway — do not set it manually.

**Networking:** Settings → Networking → Generate Domain, so the service gets a public `https://mandate-server-production.up.railway.app`-style URL. The client needs this URL for `VITE_API_URL`.

## Service 3 — mandate-client

**Root Directory:** `/` (repo root — same reasoning as above)

**Build Command:**
```
npm run build:client
```
This runs `npm run build -w shared && npm run build -w client`, producing static assets in `client/dist`.

**Start Command:**
```
npm run start:client
```
This runs `serve -s dist -l tcp://0.0.0.0:${PORT}` from the `client` workspace — a minimal static file server, with `-s` enabling single-page-app fallback so client-side routes (`/data-catalog`, `/places/chicago`, etc.) don't 404 on a hard refresh.

**Environment variables:**

| Variable | Value | Notes |
| --- | --- | --- |
| `VITE_API_URL` | the server service's public URL from above, e.g. `https://mandate-server-production.up.railway.app` | **Build-time**, not runtime — Vite bakes this into the JS bundle. Changing it requires a redeploy (rebuild), not just a restart. Railway's variable reference syntax also works here: `https://${{mandate-server.RAILWAY_PUBLIC_DOMAIN}}`. |

**Networking:** Settings → Networking → Generate Domain. This is the URL your users actually visit.

## Deployment order (matters on first setup)

1. Add the Postgres plugin.
2. Deploy **mandate-server** first. Generate its public domain.
3. Set `CLIENT_URL` on the server once you know the client's domain (can circle back after step 4 and redeploy).
4. Set `VITE_API_URL` on **mandate-client** to the server's domain from step 2, then deploy the client.
5. Once the client has its own public domain, go back to the server's variables, set `CLIENT_URL` to it, and redeploy the server so CORS is scoped correctly (or leave `CLIENT_URL` unset if you'd rather CORS stay permissive — it falls back to reflecting any origin).

## One-time setup: seeding the database

The build/start commands above don't seed the database — that's a deliberate one-off task, not something that should run on every deploy or restart. Do it once, after the first successful deploy (and again any time you need to re-sync reference data — it's safe to re-run, see below).

**The seed command is production-gated.** Because `NODE_ENV=production` is set on the `mandate-server` service (per the variables table above), `npm run db:seed -w server` will refuse to run unless you also pass `SEED_CONFIRM=yes` — this exists so the seed script can never fire as an accidental side effect of some other automated process. The full command is always:
```
SEED_CONFIRM=yes npm run db:seed -w server
```

What it does — and doesn't do — to an existing database: reference data (sources, categories, metric definitions, governance models, jurisdictions) is upserted by stable keys, so re-running is safe and idempotent. Metric values are regenerated *only* for rows still flagged placeholder; any real observations already imported (`dataQuality` official/estimated) are left untouched. This means you can safely re-run it later after a code change to the seed data without wiping real data you've since imported.

### Option 1 — temporarily swap the Start Command (no CLI needed)

1. `mandate-server` service → **Settings** → **Deploy** → **Start Command**. Note the current value (`npm run start:server`) so you can restore it.
2. Change it to:
   ```
   SEED_CONFIRM=yes npm run db:seed -w server
   ```
3. Trigger a deploy (Railway does this automatically when you change a setting, or use **Deploy** → **Redeploy**).
4. Watch the **Deploy Logs** tab for `Done. Seeded 3168 metric values across 6 jurisdictions and 48 metrics.` The process will then exit — that's expected for this one-off command, but it means Railway will show the deployment as "crashed" or "stopped" once it does. That's fine and expected; you're about to replace the Start Command anyway.
5. **Immediately change the Start Command back** to `npm run start:server` and redeploy, so the service resumes actually serving the API.

### Option 2 — Railway CLI

If you have the [Railway CLI](https://docs.railway.app/guides/cli) installed and linked to this project (`railway login`, `railway link`):
```
railway run --service mandate-server -- sh -c "SEED_CONFIRM=yes npm run db:seed -w server"
```
`railway run` executes the command with that service's environment variables (including `DATABASE_URL`) injected. Note this runs *on your local machine*, not inside Railway's infrastructure — it only works if your machine can actually reach the database, which requires the Postgres plugin's public networking/TCP proxy to be enabled (internal `*.railway.internal` hostnames are only reachable from other Railway services). If it hangs or fails to connect, use Option 1 instead — it runs the command inside the actual deployed environment, so networking is never a concern.

## Database backup & recovery

Mandate's production database (Railway's managed Postgres plugin, one volume — `postgres-volume`, mounted at `/var/lib/postgresql/data`, currently on a size-capped Hobby-tier plan) is not currently covered by any automated, verified backup process. This section is the procedure until one is automated.

**Do not confuse this with reseeding.** `npm run db:seed` (see above) only ever adds/upserts data and is safe to re-run — it is not a backup mechanism and does not protect against a bad migration, a mistaken production SQL statement, or Railway-side data loss on the volume.

### Who should have access

Production backups and the ability to restore one are a **founder-level responsibility** (see `docs/DECISION_OWNERSHIP.md`) — not something delegated to researchers, and not something a new contributor should be handed by default. A designated technical lead can hold this responsibility alongside the founder, but it should be an explicit, named decision, not something that drifts by default. Researchers interact with production data exclusively through the app's admin UI and import pipeline (see `CONTRIBUTING.md`) — never through a raw backup file or a direct database connection.

### How to create a backup

There is no dedicated backup button in this project's current Railway plan tier, so the reliable, plan-independent method is a manual `pg_dump`, run from a machine that already has this repo checked out (so `railway` CLI + Postgres client tools are available — `brew install postgresql@16` per the README covers `pg_dump`):

```bash
railway run --service server -- sh -c 'pg_dump "$DATABASE_URL" --format=custom --file=/dev/stdout' > mandate_backup_$(date +%Y%m%d).dump
```

Notes specific to this project's actual setup:
- The live service is named **`server`** (confirmed via `railway status`) — not `mandate-server`, despite that name appearing elsewhere in this doc for the hypothetical/generic case. Always confirm the exact current service name with `railway status` before running this.
- Like the reseed command above, `railway run` executes **on your local machine** and requires the Postgres plugin's public networking/TCP proxy to be enabled to reach the database from outside Railway's internal network. If the command hangs, that's almost always why.
- `--format=custom` produces a compressed, `pg_restore`-compatible file (smaller and more robust than plain SQL text) — prefer it over plain `pg_dump ... > file.sql`.
- Separately, check the Postgres service's own Railway dashboard (**Settings** tab) for a native "Backups" feature — Railway has offered automated volume snapshots on some plans. If available on the current plan, enabling it is a good *supplement* to the manual procedure above, but do not rely on it exclusively without confirming it's actually enabled and actually producing restorable snapshots — verify by attempting a real restore (see below) at least once.

### Where the backup should be stored

Store the `.dump` file in a private, access-restricted location the founder controls directly — e.g. a password-protected/encrypted personal cloud storage folder. Specifically:
- **Never** commit a backup file to this Git repository, even privately — it contains real production data (and the repo's history is effectively permanent).
- **Never** store it in a shared, publicly-linkable, or unencrypted location.
- Keep at least the two most recent backups, not just the latest one, in case a problem with the database predates the most recent backup.

### How often

- **Weekly**, at minimum, as a standing routine — Mandate's irreplaceable data (real Chicago pipeline research, real imported metrics, Research Queue researcher progress) changes gradually, not continuously, so weekly is a reasonable baseline rather than needing continuous/hourly backups.
- **Immediately before any operation with real risk**: a schema migration that transforms or drops a column, a manual production SQL statement of any kind, a Prisma major-version upgrade, or any operation on this list even if it's expected to be safe. Treat "I'm confident this is safe" as the exact moment a backup is cheapest and most valuable, not a reason to skip it.

### How to restore a backup

Restoring directly into production should never be the first step. Always verify a backup is actually restorable before trusting it, and never do so with a fabricated sense of confidence:

1. **Restore into a scratch/local database first**, not production:
   ```bash
   createdb mandate_restore_test
   pg_restore --dbname=mandate_restore_test --clean --if-exists mandate_backup_YYYYMMDD.dump
   ```
2. Spot-check the restored data (e.g. confirm the Chicago Housing/Transit pipeline rows and their expected row counts are present — see the verification queries used in past hardening passes) before considering the backup good.
3. Only after that verification, if an actual production restore is genuinely necessary, treat it as a founder-authorized, one-time, carefully-supervised operation — not a routine command to memorize and run confidently under pressure. At minimum: take a fresh backup of the *current* (broken) production state first, in case the restore itself needs to be undone; confirm with the founder immediately beforehand, every time, regardless of urgency.

### What should never be done directly against production

- No raw `DELETE`, `DROP`, `TRUNCATE`, or `UPDATE` statements against the production database outside of a founder-authorized, deliberate, one-time operation with a fresh backup taken immediately before.
- No `prisma migrate reset` (this drops and recreates the entire database) against production, ever.
- No restoring a backup into production without first restoring it into a scratch database and verifying it, per above.
- No disabling the `SEED_CONFIRM=yes` gate on the seed script, and no editing `server/prisma/seed/index.ts` to skip it.
- No treating a backup file as a casual export to inspect data — use the admin UI or `/data-catalog` for that; a backup file is a production-data asset and should be handled with the same care as the live database.

## Verifying the deployment

- `https://<server-domain>/api/v1/governance-models` should return JSON.
- `https://<client-domain>/` should load the app, and `https://<client-domain>/dashboard` should load directly (not 404) — this confirms the SPA fallback is working.
- `https://<client-domain>/admin/login` should let you log in with the password you hashed into `ADMIN_PASSWORD_HASH`, and land you on `/admin/imports` — this confirms the cross-origin cookie (`CLIENT_URL`, `SESSION_SECRET`, `sameSite=None; Secure`) is configured correctly.

## Troubleshooting

### `Error: Environment variable not found: DATABASE_URL` (Prisma error P1012)

The server's `start` script now checks for this up front and fails with a clearer message before Prisma even runs (`server/scripts/check-env.js`) — if you still see Prisma's raw P1012 error, redeploy after pulling the latest code so that check is in effect.

The underlying cause is always the same: `DATABASE_URL` isn't actually present in the `mandate-server` service's environment at runtime. Check, in order:

1. **Does the variable exist on the correct service?** Railway → your project → `mandate-server` service → Variables tab. If `DATABASE_URL` isn't listed at all, add it.
2. **Did a `${{Postgres.DATABASE_URL}}`-style reference actually resolve?** Click into the variable's value in the Variables tab — if it still shows the literal `${{...}}` text instead of a real `postgresql://...` connection string, the reference didn't resolve. This almost always means the name before the dot doesn't match your Postgres service's actual name in this project (Railway auto-names it, e.g. `Postgres` or `Postgres-abc1`) — open the Postgres service and copy its exact name into the reference.
3. **Are both services in the same Railway environment?** Variable references only resolve across services within the same environment (e.g. both in "production"). If you've split services across environments, either move them together or hardcode the connection string instead of using a reference.
4. **Did you redeploy after adding/fixing the variable?** Railway doesn't always trigger an automatic redeploy for variable-only changes, depending on project settings. Trigger one manually (Deployments → Redeploy) after confirming step 2 shows a real value.

### Admin login works locally but not in production

Almost always a `CLIENT_URL`/cookie issue: confirm `NODE_ENV=production` is set on `mandate-server` (this is what switches the session cookie to `SameSite=None; Secure`, required cross-origin), and that you're accessing the client over `https://` (Railway's public domains are HTTPS by default, but custom domains need to be configured for it).

## Alternative: single-service deployment

If you'd rather run one Railway service instead of two, the server already supports it: build both shared+client+server (`npm run build`), and the Express server will detect `client/dist` at runtime and serve it directly (see `server/src/app.ts`) alongside the API, with no `VITE_API_URL`/`CLIENT_URL` needed since everything is same-origin. Build Command: `npm run build`. Start Command: `npm run start` (root). This trades independent scaling/deploys of the two halves for a simpler single-service setup.
