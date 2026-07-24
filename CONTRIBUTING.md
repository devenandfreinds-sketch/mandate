# Contributing to Mandate

This is engineering-facing documentation. If you're a researcher adding data or pipeline assessments
rather than writing code, you want `docs/RESEARCHER_HANDBOOK.md` and `docs/RESEARCH_SOP.md` instead —
most of that work happens through the admin UI, not by editing this repository.

## Repository structure

```
shared/   @mandate/shared — DTO types shared by client and server (build this first; both depend on it)
server/   Express API + Prisma schema/migrations/seed
client/   Vite + React frontend
imports/  CSV-first data staging area (see imports/README.md) — not part of the app itself
docs/     Methodology, researcher, and operations documentation (this file's siblings)
```

npm workspaces monorepo. Adding a new governance model, city, category, metric, or pipeline research case
is a **data change**, never a schema migration — see `server/prisma/schema.prisma`'s top-level comments
for the core hierarchy (`GovernanceModel → Jurisdiction → Administration`, `Category → MetricDefinition →
MetricValue`, `PolicyArea → PipelineAssessment`).

## Where data lives

- **Reference/taxonomy data** (categories, metric definitions, governance models, jurisdictions, policy
  areas): `server/prisma/seed/data/*.ts` — plain TypeScript arrays, upserted by slug on every seed run.
- **Real Chicago pipeline research** (Housing, Transit): `server/prisma/seed/data/chicagoResearchedPipeline.ts`
  — hardcoded, evidence-backed rows, `isPlaceholder: false`. Treat this file as historical record: the
  seed script creates a row here only if it doesn't already exist (by jurisdiction+policyArea+date) and
  never updates or deletes it. To correct a genuine mistake, either add a new dated entry or manually
  edit the specific database row directly — don't just change old array entries and re-seed, since the
  seed script won't touch what's already there.
- **Research Queue seed** (`server/prisma/seed/data/researchQueue.ts`): the starting task list. Same
  discipline — reseeding never overwrites a researcher's status/assignee/notes on an existing task.
- **Synthetic placeholder data**: everything else, generated deterministically by
  `server/prisma/seed/generators/*.ts`. Always `isPlaceholder: true`, regenerated on every reseed.

## Where sources live

`server/prisma/seed/data/sources.ts` — the Source Registry. Every source needs: a unique `name`, a
`sourceType` (`government_dataset` | `government_report` | `academic` | `news` | `financial_data` |
`placeholder`), a `publisher`, and ideally a `url` and `methodology` note. **Never add a vague source**
("News," "Government Website") — name the specific agency or outlet. The one intentionally generic
source, `local_news`, is reserved for synthetic/placeholder data only; real citations always get a
specific named source.

## How imports work

See `imports/README.md` for the full CSV import pipeline. Short version: download an official dataset,
shape it into the standard 5-column CSV, then import via `npm run import -w server -- --file <path>
--source "<name>" --quality <level> --dry-run` (drop `--dry-run` to commit) or via the Admin Import
Panel at `/admin/imports`. Every commit is a rollback-able `ImportJob`.

**`--quality` has no safe default — always pass it explicitly.** The valid values are `government |
academic | alternative | estimated | unavailable | placeholder` (the legacy value `official` still
exists on old rows for backward compatibility, but never use it for new data — use `government`).

## How seeds work

`npm run db:seed` (or `SEED_CONFIRM=yes npm run db:seed -w server` in production) runs
`server/prisma/seed/index.ts`, an 11-step idempotent script. Two invariants that must never regress —
both were real bugs found and fixed in past hardening passes, so treat them as load-bearing:

1. **Reference tables are upserted by slug/key, never deleted-and-recreated.** A `deleteMany({})`
   followed by recreation looks harmless until something else cascades on delete — this exact mistake
   (on `PolicyArea`) silently destroyed all real pipeline research on every reseed until it was caught.
2. **Real/researcher-owned data survives every reseed.** `PipelineAssessment`/`EvidenceLink`/
   `SupportingLegislation`/`ResearchTask` deletes (where they exist at all) are scoped to
   `isPlaceholder: true` rows only; `ResearchTask` upserts never touch `status`/`assignedResearcher`/
   `sourceStatus`/`notes` on an existing row.

If you add a new seed data file with any "real" (non-synthetic) rows, follow the same pattern: a stable
unique key, create-if-missing (or update-only-seed-owned-fields), never a blind delete+recreate.

## Getting access (before any of the below works)

A new contributor needs, in this order: (1) a GitHub invite to this repository — ask the current admin
or founder to add you as a collaborator (Settings → Collaborators on GitHub), since `git clone` requires
it; (2) the shared admin password for `/admin/*` (see `docs/RAILWAY_DEPLOYMENT.md`'s "Access & ownership
transfer" section for how that's issued/rotated); (3) whichever communication channel the team has
designated for reaching a reviewer or the founder-as-advisor (see the same section — if none has been
designated yet, that's a real gap to raise, not something to guess at). None of this is automated; all
of it currently requires a human on the other end to grant it.

## How local development works

Requires PostgreSQL installed and running locally first — e.g. `brew install postgresql@16 && brew
services start postgresql@16` on macOS, or your OS's equivalent. Confirm it's running with `psql
postgres` before continuing.

```bash
createdb mandate_dev
cp .env.example server/.env   # DATABASE_URL should look like postgresql://<your-os-username>@localhost:5432/mandate_dev?schema=public
                               # (no password needed for a local trust-auth Postgres install; if yours requires one, add it: postgresql://user:password@localhost:5432/mandate_dev)
npm install                    # installs all workspaces, builds @mandate/shared
npm run db:migrate
npm run db:seed
npm run dev                    # server on :3001, client on :5173 (proxies /api)
```

## How to run tests/typechecks/builds

```bash
npm run build     # shared → server → client, in that order; this IS the typecheck (tsc -b / tsc -p)
npm run test -w server   # vitest — currently covers period-boundary parsing (server/src/import/validators.test.ts)
```

Automated test coverage is intentionally minimal, not absent — a handful of `vitest` tests exist for the
import pipeline's period-parsing logic (the exact area a past real bug came from), not a full suite.
`npm run build` passing cleanly remains the primary automated correctness signal. Manual browser
verification of anything UI-facing is expected before considering a change done.

## How to add a new source

Add an entry to `server/prisma/seed/data/sources.ts` with a unique `key` (used only within seed scripts)
and `name` (shown to users), then run `npm run db:seed`. Sources are upserted by `name`, so re-running is
always safe.

## How to add a new metric

1. Add a `MetricDefinition` entry to the relevant `server/prisma/seed/data/metricDefinitions/*.ts` file.
2. If it has a known canonical source, add an entry to `server/prisma/seed/data/metricSourceAssignments.ts`.
3. Run `npm run db:seed` — it starts out `isPlaceholder: true` with synthetic values until real data is
   imported (see "How imports work" above).

## How to add a pipeline assessment

Prefer the Admin UI (`/admin/pipeline`) over editing seed files directly — that's what it's for, and it
enforces the evidence-required-above-Stage-0 rule and correct `isCurrent` handling automatically. Only
touch `chicagoResearchedPipeline.ts` directly for the kind of one-time, heavily-reviewed case-study work
described in `docs/RESEARCHER_HANDBOOK.md` and `docs/RESEARCH_SOP.md`.

## What contributors should never do

- **Never delete production data.** No `DELETE FROM` against the production database, ever, for any
  reason, without explicit founder sign-off immediately beforehand.
- **Never run destructive SQL directly against any shared database** (local `mandate_dev` is fine to
  reset for your own testing; anything shared is not).
- **Never modify production directly** — all changes reach production via `git push` → Railway build →
  `prisma migrate deploy` (automatic in the server's `start` script) → optional reseed. See
  `docs/RAILWAY_DEPLOYMENT.md`.
- **Never rewrite seed data without understanding what's already real.** Check `isPlaceholder` on
  existing rows before changing a seed file that touches them.
- **Never replace real data with placeholder data**, even temporarily "to test something."
- **Never use an unsupported or unnamed source**, or label a source at a higher tier than it actually is.
- **Never commit secrets** (`.env`, credentials, API keys) — check `git status`/`git diff` before every
  commit.
- **Never restore a database backup into production without founder sign-off**, and never without first
  restoring it into a scratch/local database to verify it — see `docs/RAILWAY_DEPLOYMENT.md` § "Database
  backup & recovery."

## Production deployment

Fully documented in `docs/RAILWAY_DEPLOYMENT.md`. In short: push to `main`, Railway builds both services,
`prisma migrate deploy` runs automatically on server start. A reseed is a separate, explicit step
(`railway run --service server -- sh -c "SEED_CONFIRM=yes npm run db:seed -w server"`) — never automatic,
and safe to run repeatedly given the idempotency guarantees above. Database backup and recovery
(creating one, where to store it, how to restore) is also documented there, under "Database backup &
recovery" — a founder-level responsibility, not a routine contributor task.
