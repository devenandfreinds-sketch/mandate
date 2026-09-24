# Mandate — Session Handoff (as of 2026-09-18)

This is a working-session handoff, not the project's full documentation — for that, start at
`docs/START_HERE.md`, which routes engineers to `CONTRIBUTING.md` / `docs/MANDATE_OPERATING_SYSTEM.md` /
`docs/RAILWAY_DEPLOYMENT.md` and researchers to `docs/RESEARCHER_HANDBOOK.md` / `docs/RESEARCH_SOP.md`.
Read this file for what's true *right now* and what a previous session actually learned by doing that
isn't written up elsewhere yet.

## Backend conventions learned this session

**CSV import pipeline**: `imports/data/<category>/<city>-<metric>-<years>.csv`, columns
`jurisdiction,metric,year,value,confidence,notes`. Import with:

```bash
npx tsx server/src/import/cli.ts --file <csv> --source "<exact Source.name>" \
  --quality <government|academic|alternative|estimated|unavailable|placeholder> \
  --period-type <year|uk_fiscal_year|uk_academic_year|quarter|month> [--currency GBP]
```

`--source` must match the `Source` model's `name` field exactly — `resolveSourceId()` in `cli.ts` looks
up by DB id or `name`, never the seed file's `key` slug.

**dataQuality vocabulary** (`shared/src/types/pipeline.ts`): government/academic/alternative describe
source tier; `estimated` means a real source existed but reaching the number required synthesis
(combining tables, substituting a mean for a literal median, etc.); `unavailable` means *confirmed no
source exists* — distinct from `placeholder`, meaning *not yet researched*. Both render differently in
the UI; the distinction is the point, not a technicality.

**Seed-script gotcha that costs real time**: `server/prisma/seed/index.ts` deletes all
`placeholder`/`unavailable` `MetricValue` rows and regenerates them every run, *except* for
(metric, jurisdiction) pairs that already have real data on a period type other than `"year"` (see the
`realDataPairs` block, ~line 555). Import real data on `uk_fiscal_year`/`uk_academic_year` and you must
reseed **once more** afterward to clear stale calendar-year placeholder duplicates left over from before
the import existed. Import on plain `"year"` matching the placeholder generator's own convention and
`skipDuplicates` handles it in one pass. Always verify the final state with `psql`, not just the import
summary's row counts.

**PipelineAssessment real-data pattern**: one file per jurisdiction (e.g.
`server/prisma/seed/data/durhamResearchedPipeline.ts`), exporting
`<jurisdiction>ResearchedPipelineAssessments: ResearchedPipelineAssessmentSpec[]`, spread into
`allResearchedPipelineAssessments` in `index.ts` (~line 377) so the synthetic generator skips those
(jurisdiction, policyArea) pairs. Multiple institutions under one policy area use the optional
`institutionName` field — the detail page only renders one institution's timeline per policy area at a
time (a known display limitation, not a bug worth chasing right now).

**Local → production sync workflow**, always in this order:
1. `npm run build -w shared -w server` (typecheck)
2. `SEED_CONFIRM=yes npm run db:seed -w server` (local dev DB: `postgresql://devenmishra@localhost:5432/mandate_dev`)
3. Run each CSV import locally
4. Reseed locally once more (clears stale placeholders)
5. Verify via `psql` + the browser preview (local `mandate-client`/`mandate-server`)
6. Commit + push
7. Repeat steps 2–4 against production, prefixing each command with `railway run --service server -- `
8. Reseed production once more, then verify live on mandate.city

Railway commands routinely exceed the tool's default timeout and move to background — that's normal,
just wait for the completion notification rather than re-running.

**Browser preview quirk**: the `.claude/launch.json` the Browser preview tool reads lives at the
*parent* directory (`/Users/devenmishra/Documents/Claude/.claude/launch.json`), not this repo's own
`.claude/launch.json`. The `mandate-server` (port 3001) and `mandate-client` (port 5173) configs are
defined there. Dev servers get stopped automatically after long idle periods — check `preview_list` if a
previously-working tab stops responding.

## Research discipline established this session

- **Primary sources only, never blend methodologies silently.** Every value traces to a real URL. When
  two sources disagree, or a figure needed interpretation rather than a direct read, say so in the row's
  own notes — pick a primary source explicitly rather than averaging or choosing arbitrarily.
- **When no source cleanly matches what a metric actually measures, leave it honestly `unavailable`
  or `placeholder` rather than force-fitting a different concept.** Came up repeatedly: Greater
  Manchester's progressive-revenue-institution, and Durham's rental-vacancy/homelessness/planning-time
  metrics, where the only UK-available data measures a genuinely different thing than the US-centric
  metric definition names.
- **Verify before declaring done**: reseed, `psql`-check, and load the actual page in a browser (local,
  then production) — don't trust import-summary row counts alone.
- **Avoid AI-sounding prose** in anything user-facing (Findings articles, site copy — not code):
  repeated "It's not X. It's Y." antithesis, "Same X. Same Y." fragment triplets,
  rhetorical-question-then-immediate-answer, and em-dashes are all things the user has explicitly
  flagged and asked to be rewritten out.
- **Every commit ends with** `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`; **PR
  descriptions end with** the Claude Code generated-by line.
- **Communication style**: brief, direct updates at decision points, not a running commentary.

## Current state: Durham County Council data-completeness effort

Durham (`durham-county`) is Mandate's flagship "first Reform UK case study" (single-tier unitary
authority, North East England, ~530,000 residents; Reform UK won outright control May 2025, ending a
**Liberal Democrat-led coalition** under Amanda Hopgood, 2021–2025 — not Labour, a wrong assumption
worth not repeating). It had zero real research when this effort started — every `PipelineAssessment`
was synthetic placeholder, and every category's metric time series was 100% synthetic, unlike every
other Mandate jurisdiction.

**Done:**
1. **Institutional pipeline**, all 7 policy areas (`durhamResearchedPipeline.ts`). DurhamWorks scored
   stage 5 on a DWP impact evaluation; Finance Durham Fund + NETPark scored stage 4;
   alternative-crisis-response and progressive-revenue-institution both scored `unavailable`.
2. **Housing metrics** — completions, starts, affordable completions, permits issued, median rent,
   2014–2025. Rental vacancy rate, homelessness count, and planning approval time deliberately left
   placeholder (genuine definitional mismatches, not laziness).
3. **Workforce metrics**, all 7. Caught and fixed a near-miss: a first pass pulled ASHE's full-time-only
   wage figure, which would have spliced a different wage measure onto the all-employee-jobs series
   already on file. graduate_employment_rate confirmed `unavailable` (no UK LA-level source exists).

**Remaining**: Innovation, Government Capacity, Transit, Public Safety, and Fiscal Health are still
placeholder for Durham.

**⚠️ Open flag, unresolved**: `docs/DURHAM_CASE_STUDY.md` predates this effort and explicitly defers
scoring `workforce-development-institution` for Durham pending a methodology-lead decision: does
Mandate's Institutional Pipeline track *jurisdiction-level institutional history* (credit any real
institution regardless of which administration built it) or *administration-attributable achievement*
(credit only the tracked administration)? DurhamWorks predates/sits outside Reform's tenure, and the doc
frames this exact case as the one that needs the decision first. The pipeline round above scored it
anyway at stage 5 — implicitly choosing "jurisdiction history" without that explicit sign-off. Whoever
picks this up next should either get sign-off after the fact or revisit the score, and update the stale
case-study doc either way.
