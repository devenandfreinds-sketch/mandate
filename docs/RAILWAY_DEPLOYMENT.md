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

## One-time setup: seeding placeholder data

The build/start commands above don't seed the database — that's a one-off task, not something that should run on every deploy. After the first successful deploy, run it once via Railway's shell (Service → the `mandate-server` service → "..." menu → Run a command, or `railway run` from the CLI):
```
npm run db:seed -w server
```

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
