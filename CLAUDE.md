# Mandate

Tracks whether urban political movements deliver measurable results in government, using publicly
sourced statistics. npm-workspaces monorepo: `shared` (DTO types, build first) → `server` (Express +
Prisma + Postgres) → `client` (Vite + React + Tailwind).

## Commands

```bash
npm install                 # also builds @mandate/shared (postinstall)
npm run build               # shared → server → client; this IS the typecheck
npm run test -w server      # vitest (import validators, outreach, seriesQuality)
npm run dev                 # server :3001, client :5173 (needs Postgres + server/.env)
npm run import -w server -- --file <csv> --source "<Source.name>" --quality <tier> --dry-run
```

`--quality` has no default: `government | academic | alternative | estimated | unavailable |
placeholder`. Never use the legacy `official` for new data.

## Where things are

- `server/prisma/schema.prisma` — data model. New cities/metrics/categories are data inserts, never
  migrations.
- `server/prisma/seed/data/*.ts` — reference data, Source Registry (`sources.ts`, upserted by `name`),
  metric definitions, per-city `*ResearchedPipeline.ts` (historical record: create-if-missing only).
- `server/src/import/` — CSV/JSON import pipeline (validators, runner, rollback).
- `client/src/content/findings.ts` — published Findings; references files under `imports/research/`.
- `imports/data/<category>/<jurisdiction>-<metric>-<years>.csv` — import-ready CSVs. Fixed header
  `jurisdiction,metric,year,value,confidence,notes`; LF endings; rows sorted by jurisdiction, metric,
  year. One file per source pull — overlapping files for the same metric are separate provenance, not
  duplicates. Do not merge, rename, or move them: seed files, `PRODUCTION_SYNC_*.md` logs and docs cite
  these paths.
- `imports/research/<topic>-<YYYY-MM>/` — research briefs (md, charts, PDFs, source CSVs).
  `PRODUCTION_SYNC_*.md` are logs of what was imported to production.
- `docs/START_HERE.md` — index of the 29 docs; `CONTRIBUTING.md` — the authoritative engineer guide.

## Rules that are load-bearing

- Seeds: reference tables are upserted by slug, never delete-and-recreate; real (`isPlaceholder:
  false`) and researcher-owned rows must survive every reseed.
- Never replace real data with placeholder data; never touch production data or run destructive SQL
  against a shared database.
- Every real figure needs a specific named source at its true quality tier; cite report/table/page in
  the CSV `notes` column. No vague sources.
- No code calls live government APIs; data is downloaded manually, then imported.
- UI changes: verify in a browser before calling them done.
