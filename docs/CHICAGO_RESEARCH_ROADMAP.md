# Chicago Institutional Pipeline — Research Roadmap

Status: Housing (Affordable Housing Production, Stage 4) and Transit (Transit Network Expansion, Stage
3) are complete, evidence-backed pilots. This roadmap ranks the next 10 highest-value Chicago research
tasks — mixing pipeline-assessment research and raw-metric data pulls in one interleaved priority order,
not bucketed by type — and is seeded directly into the Research Queue (`/admin/research-queue`) so it's
actionable, not just a document.

**This is explicitly not a "fill every card" list.** The goal is a small set of methodologically diverse
case studies plus the metric pulls that most reinforce them — not maximizing the count of researched
cards.

## Prioritization criteria

Each task below is ranked by weighing, in combination:

1. **Public value** — does this answer a question people actually care about?
2. **Availability of high-quality sources** — is there a real Tier 1/2 path, or would this require
   chasing thin/paywalled data?
3. **Research effort** — how much work to reach a defensible conclusion?
4. **Importance to the Institutional Pipeline Index** — does this stress-test the methodology in a new
   way, or reinforce an existing case study?
5. **Ability to demonstrate Mandate's methodology** — is this a good teaching example for future
   researchers?

Easy metrics are not automatically prioritized over harder, higher-value pipeline research — see task
#1 vs. task #9/#10 below.

## The ranked Top 10

| # | Task | Type | Why it matters | Best likely source | Tier | Difficulty | Single person or splittable |
|---|---|---|---|---|---|---|---|
| 1 | Alternative Crisis Response pipeline | Pipeline assessment | Chicago's CARE program (2021 pilot → 2026 citywide) is a live national debate with an unusually clean multi-stage timeline and genuine independent critical evaluation to weigh against city self-reporting — the first "emergent multi-agency pilot" topology in the dataset. | City CARE annual reports; University of Chicago Urban Labs/Harris School evaluation | Gov't (Tier 1) + Academic (Tier 2) | Moderate | Single person |
| 2 | Crime rate metrics (violent + property) | Metric | Highest public-value metric currently 100% placeholder; directly usable, city-granular, updated daily. | Chicago Data Portal — "Crimes - 2001 to Present" (CPD CLEAR system) | Government | Moderate | Single person (same dataset backs both metrics) |
| 3 | Permitting & Procurement Modernization pipeline | Pipeline assessment | Dept. of Buildings' Express Permit Program has a precisely dated rollout — a clean single-agency reform. Also surfaces a real scoping question: the card bundles "Permitting" (clean) with "Procurement" (fragmented across multiple bodies). | chicago.gov DOB program pages | Government | Easy–Moderate | Single person |
| 4 | `permit_approval_days` metric | Metric | Reuses the exact dataset already backing the real `planning_approval_days` Housing metric — low marginal cost, pairs directly with task #3. | Chicago Data Portal — "Building Permits" | Government | Easy–Moderate | Single person |
| 5 | Progressive Revenue Institution pipeline | Pipeline assessment | "Bring Chicago Home" referendum (defeated Mar 2024, 53.2%-46.8%) is the highest-value case for honestly scoring a **failed** institutionalization — a genuinely different edge case than every existing success-oriented study. | AP/ABC7/Block Club referendum coverage; City Council legislative record | Alternative (Tier 3, named outlets) | Easy (well-covered) | Single person |
| 6 | `transit_ridership` metric | Metric | Reinforces the already-completed Transit pipeline case with real quantitative backing. | Chicago Data Portal CTA annual boarding totals + RTAMS for Metra/Pace | Government | Moderate | Single person (CTA-only first cut is easy; full NTD-consistent total is harder) |
| 7 | `affordable_housing_completions` metric completion | Metric | Already 8 of 11 years real ("estimated," from the DOH Annual Report) — completing the remaining 3 years is low-effort and directly strengthens the flagship Housing pipeline case. | Chicago Dept. of Housing Annual Report | Government (via researcher synthesis → "estimated") | Easy | Single person |
| 8 | Workforce Development Institution pipeline | Pipeline assessment | Chicago Cook Workforce Partnership is a real, funded institution, but almost all reporting is regional (City + Cook County) — a bi-jurisdictional attribution problem. | Chicago Cook Workforce Partnership reports; WIOA/EDA filings | Government | Moderate–Hard | **Splittable** — one researcher on the City-side WIOA/partnership formation, one on the Cook County co-governance/regional-reporting side, then reconcile |
| 9 | `unemployment_rate` metric | Metric | Easy, free, well-documented; reinforces task #8. | BLS Local Area Unemployment Statistics (LAUS), Chicago place series | Government | Easy | Single person |
| 10 | `median_wages` metric | Metric | Easy-moderate; completes the workforce quantitative picture alongside #8/#9. Note: ACS 1-year estimates were not published for 2020 (COVID suspension) — the series will have a documented gap that year. | Census ACS 1-year estimates (table S2001/B20002) | Government/Academic | Easy–Moderate | Single person |

## Deferred, not abandoned

- **Public Innovation & Startup Investment Vehicle pipeline** — no single clear city-operated institution
  (World Business Chicago is a public-private nonprofit; P33/TechChicago is independent; Illinois INVENT
  is a *state*, not city, program), and its flagship metric (`vc_investment`) depends on paywalled
  PitchBook-NVCA data. Best future candidate for a "diffuse/privatized institution" edge case once a
  Tier 1/2 path exists.
- `digital_government_adoption` metric — no standardized index exists; already correctly documented
  internally as weak. Not worth chasing until a real methodology for it exists.
- `vc_investment` metric — paywalled, no free city-level series found.

## How this ties to the Research Queue

All 10 tasks above are seeded into the `ResearchTask` table (`server/prisma/seed/data/researchQueue.ts`)
as `unassigned`, visible and workable at `/admin/research-queue`. Reseeding never resets a task's
status/assignee/notes once a researcher has picked it up — see the seed script's `[10c/11]` step. If this
roadmap changes (a task is reprioritized, split, or dropped), update the roadmap here **and** the seed
file together, and note in the seed file's own comment why a discrepancy might temporarily exist.
