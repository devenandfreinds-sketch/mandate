# CLAUDE.md

Loaded automatically at the start of every Claude Code session, local or cloud. It holds the rules
that apply to all work in this repo and a map of where the research lives. It does not track project
status: for what changed recently, read `git log` and the newest `imports/research/PRODUCTION_SYNC_*.md`.

## What Mandate is

Mandate tracks whether emerging urban political movements deliver measurable results once they enter
government, using transparent, publicly sourced statistics. Live site: mandate.city.

Jurisdictions (seed slugs): `new-york-city`, `chicago`, `minneapolis`, `seattle`, `washington-dc`,
`greater-manchester`, `durham-county`.

## Where the research lives

| What | Where |
| --- | --- |
| Reading order for newcomers | `docs/START_HERE.md` |
| Methodology (why) and checklist (how) | `docs/RESEARCHER_HANDBOOK.md`, `docs/RESEARCH_SOP.md` |
| Pipeline scoring rules | `docs/PIPELINE_METHODOLOGY.md` (section 11: jurisdiction-history rule) |
| Data-quality vocabulary | `docs/DATA_QUALITY_MODEL.md`, `shared/src/types/pipeline.ts` |
| Case studies | `docs/DURHAM_CASE_STUDY.md`, `docs/GREATER_MANCHESTER_CASE_STUDY.md`, `docs/REFORM_UK_PILOT_STUDY.md`, `docs/DSA_RESEARCH_MASTER_REPORT.md` |
| What was already tried and rejected | `docs/CHICAGO_RESEARCH_ROADMAP.md`, `docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md` |
| Raw research pulls, sweeps, critiques | `imports/research/` |
| Production sync runbooks | `imports/research/PRODUCTION_SYNC_*.md` |
| Metric CSVs ready to import | `imports/data/<category>/` |
| Researched pipeline assessments | `server/prisma/seed/data/*ResearchedPipeline.ts` |
| Published Findings articles | `client/src/content/findings.ts` |
| Source registry | `server/prisma/seed/data/sources.ts` |
| Who decides what | `docs/DECISION_OWNERSHIP.md` |
| Automation scoping, outreach CRM | `docs/INGESTION_AUTOMATION.md`, `docs/OUTREACH.md` |
| Deploying and production ops | `docs/RAILWAY_DEPLOYMENT.md` |

Before researching a metric or jurisdiction, read its case study, roadmap and `imports/research/`
files so you don't repeat a search someone already exhausted.

`ONBOARDING.md` is a September 2026 session handoff. Its conventions still hold; its "Current state"
section is out of date (Durham and Greater Manchester research have since been completed).

## Research rules

- **Primary sources only.** Every value traces to a real URL. When two sources disagree, or a figure
  needed interpretation rather than a direct read, say so in the row's notes and pick one source
  explicitly. Never average or silently blend methodologies.
- **Don't force-fit.** If no source measures what the metric definition actually names, leave it
  `unavailable` (confirmed that no source exists) or `placeholder` (not yet researched). Those two mean
  different things and render differently; the distinction is the point.
- **`estimated`** means a real source exists but reaching the number took synthesis (combining tables,
  a proxy definition, a mean standing in for a median).
- **Watch for spliced series.** Don't join a differently defined measure onto an existing series (for
  example, the ASHE full-time-only wage versus the all-employee-jobs wage).
- **Pipeline stages measure jurisdiction-level institutional history**, whoever built the institution,
  with provenance stated explicitly (`PIPELINE_METHODOLOGY.md` section 11).
- **Methodology gaps go to the founder** as a proposed addition to the Handbook. Don't resolve them
  case by case (`docs/DECISION_OWNERSHIP.md`).

## Writing rules for user-facing prose

These apply to Findings articles and site copy, not code. The founder has flagged each of these
patterns and asked for them to be rewritten out:

- "It's not X. It's Y." antithesis
- "Same X. Same Y." fragment triplets
- a rhetorical question followed immediately by its answer
- em-dashes

## Engineering conventions

- Monorepo with npm workspaces: `shared/` (DTO types), `server/` (Express, Prisma), `client/` (Vite,
  React). Adding a city, category or metric is a data insert, never a schema migration.
- Typecheck: `npm run build -w shared -w server`. Tests: `npm test -w server`.
- **CSV import**: files are `imports/data/<category>/<city>-<metric>-<years>.csv` with columns
  `jurisdiction,metric,year,value,confidence,notes`.

  ```bash
  npx tsx server/src/import/cli.ts --file <csv> --source "<exact Source.name>" \
    --quality <government|academic|alternative|estimated|unavailable|placeholder> \
    --period-type <year|uk_fiscal_year|uk_academic_year|quarter|month> [--currency GBP]
  ```

  `--source` must match the `Source.name` exactly, not the seed file's `key` slug. Write commands out
  in full. Don't wrap them in shell helpers: that is how `--currency GBP` got dropped once.
- **Seed gotcha**: the seed regenerates every `placeholder`/`unavailable` value on each run, except
  (metric, jurisdiction) pairs that already have real data on a non-`year` period type (`realDataPairs`
  in `server/prisma/seed/index.ts`). After importing `uk_fiscal_year` or `uk_academic_year` data,
  reseed once more to clear the stale calendar-year placeholders. Verify the result with `psql`, not
  the import summary's row counts.
- **Seed confirmation**: the seed needs `SEED_CONFIRM=yes`.
- **Researched pipeline assessments**: one file per jurisdiction, spread into
  `allResearchedPipelineAssessments` in the seed. The seed never updates existing researched rows; use
  `server/prisma/seed/syncResearchedAssessment.ts` to push an edit into a database that has already
  been seeded.
- **Local to production sync order**: typecheck, reseed locally, import, reseed again, verify (`psql`
  and the page in a browser), commit and push, then repeat seed/import/reseed against production with
  `railway run --service server -- ` and verify live on mandate.city. Record the exact production
  commands in a new `imports/research/PRODUCTION_SYNC_<yyyy-mm>.md`.

## Cloud sessions

A cloud session (claude.ai/code) starts from a fresh clone and sees only what has been pushed. It has
no access to the founder's Mac, the local `mandate_dev` database, or Railway unless a token has been
added to the environment. If a task needs production, write the runbook into a `PRODUCTION_SYNC` file
for someone with Railway access to run instead of guessing at the state of production.

## Working style

Keep updates brief and direct, at decision points rather than as running commentary. When a doc
contradicts the code, trust the code and fix the doc.
