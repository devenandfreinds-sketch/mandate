# Start Here

You just joined Mandate. This page tells you what to read and what to do, in order — nothing more.

## Who are you?

**A researcher** (finding and citing real government data, scoring institutional pipelines) → go to
"For researchers" below.

**An engineer** (touching code, schema, deployment) → go to "For engineers" below.

**An outside contributor** (not on the internal team, just want to flag an error or submit a dataset) →
skip everything else and go straight to `/contribute` on the live site. No account needed.

## For researchers

Read, in this exact order:

1. **`docs/RESEARCHER_HANDBOOK.md`** — the reasoning behind Mandate's methodology. Read this first, in
   full, before touching anything.
2. **`docs/RESEARCH_SOP.md`** — the step-by-step checklist version of the same process. Keep this open
   while you work; it's the thing you'll actually re-read task to task.
3. **`docs/FIRST_WEEK_ONBOARDING.md`** — a five-day practical path from zero to your first real
   contribution live on the site.

Then get access: see `CONTRIBUTING.md`'s "Getting access" section for how to get the shared admin
password. Once you have it, your work happens at `/admin/research-queue`.

If you get stuck on a specific research question, `docs/CHICAGO_RESEARCH_ROADMAP.md` and
`docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md` document what's already been tried and rejected for those
two jurisdictions — check there before re-running a search someone already exhausted.

## For engineers

Read, in this exact order:

1. **`CONTRIBUTING.md`** — repo structure, environment setup, how to run things locally.
2. **`docs/MANDATE_OPERATING_SYSTEM.md`** — the architecture as it actually exists today (data model,
   review workflow, User/attribution model), audited from the codebase, not assumed.
3. **`docs/DECISION_OWNERSHIP.md`** — who can change what without asking anyone, and what genuinely needs
   sign-off first.
4. **`docs/RAILWAY_DEPLOYMENT.md`** — if you need to deploy, seed, back up, or troubleshoot production.

## Everything else in `docs/`

The rest of `docs/` falls into three buckets, and you generally don't need to read them up front:

- **Methodology specs** (`PIPELINE_METHODOLOGY.md`, `DATA_QUALITY_MODEL.md`, `CURRENCY_AND_UNITS.md`,
  `JURISDICTION_HIERARCHY.md`, `INSTITUTIONAL_PIPELINE_ARCHITECTURE.md`) — internal design records for
  specific pieces of the system. Read one only when you're working on that specific piece.
- **Case studies and roadmaps** (`GREATER_MANCHESTER_CASE_STUDY.md` + its roadmap,
  `REFORM_UK_PILOT_STUDY.md` + `DURHAM_CASE_STUDY.md`, `DSA_RESEARCH_MASTER_REPORT.md`) — records of
  what was researched, found, and decided for a specific jurisdiction or research pass. Read the one for
  whatever jurisdiction you're about to work on.
- **One-off audits** (`INTERNATIONAL_ARCHITECTURE_AUDIT.md`, `FIVE_YEAR_HANDOFF_TEST.md`,
  `INSTITUTIONAL_HARDENING_SPRINT_2026.md`, `FOUNDER_HANDOFF_CHECKLIST.md`,
  `RESEARCHER_CERTIFICATION.md`, `RESEARCH_MAP.md`) — point-in-time reviews. Useful context, not
  required reading.

`docs/RESEARCHER_GUIDE.md` covers similar ground to `RESEARCH_SOP.md` with two fully-worked examples;
treat `RESEARCH_SOP.md` as the canonical checklist and only open `RESEARCHER_GUIDE.md` if you want to see
a complete example worked start to finish.

## If a document contradicts what the app actually does

Trust the code, then say so. Docs drift; open an issue or fix the doc rather than assuming the doc is
right and the app is broken.
