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

## Extended pass: alternative-source research on remaining gaps (2026-07-28)

With the original Top 10 complete, this pass targeted Chicago's remaining zero/low-evidence metrics,
deliberately reaching past government-only sources into rating agencies, university tech-transfer
offices, and — where genuinely checked and found not to exist — the city's own Inspector General audits
as evidence of absence. Every candidate below was independently researched; findings that didn't clear
the bar (wrong geography, wrong scope, no numeric figure behind a rank) were **not** force-imported.

**Imported as real data:**
- `bond_rating_index` — 0/11 real → **11/11 real** (Fully Measured). Moody's/S&P/Fitch GO rating actions,
  2015-2025, sourced via City of Chicago investor relations materials and financial press (Bloomberg,
  Crain's, Sun-Times, WBEZ, ABC7). Uses a year-end-value convention (see CSV notes for the two years with
  mid-year rating changes) and Moody's own scale, mapped 1-10 per the existing
  `metricSourceAssignments.ts` methodology note.
- `life_sciences_employment` — 1/11 real → **7/11 real, 1 estimated** (Partially Measured). BLS QCEW,
  Chicago MSA, sum of NAICS 3254 + 5417 + 6215 — same three-code methodology already used for the
  existing 2023 value. 2022 stays a gap: BLS suppressed NAICS 5417 for that year (confidentiality), and
  no defensible substitute was used rather than guessing.
- `tech_employment` — 1/11 real → **6/11 estimated** (Partially Measured). BLS QCEW, Chicago MSA, NAICS
  5415 alone — matches the existing 2022 value's methodology exactly. 2015/2020/2023/2024/2025 stay gaps
  (BLS suppression for this area/NAICS combination).
- `business_formation` — 2/11 real → **11/11 real** (Fully Measured). Census Business Formation
  Statistics has no city or MSA product; Cook County is the closest available proxy and was already the
  documented methodology for the existing 2024/2025 values — extended across the full 2015-2023 run.

**Marked `unavailable` (investigated, no defensible source found — not simply "unresearched"), with the
underlying investigation documented in `server/prisma/seed/data/unavailableMetrics.ts`:**
- `digital_government_adoption` — Center for Digital Government's Digital Cities Survey never publishes
  a 0-100 score for any city, Chicago included (only ordinal ranks, and Chicago placed in the top 10 just
  twice: 9th in 2018, 8th in 2020). No substitute index exists that covers Chicago.
- `emergency_response_minutes` — Chicago's own Office of Inspector General has audited CFD/EMS
  response-time measurement four times (2013/2015/2021/2025) and each time found the data still isn't
  computed by median/percentile with usable completeness; a separate 2023 OIG audit found CPD 911 arrival
  timestamps recorded only 49% of the time. This is a confirmed measurement gap, not an unresearched one.
- `capital_budget_execution_rate` — no OBM/ACFR/Civic Federation publication states a planned-vs-actual
  capital execution percentage; OIG's Dec 2020 CIP audit found the practice of tracking this doesn't
  exist at all in the four largest capital-spending departments.
- `major_infrastructure_delivery_rate` — no Chicago agency, OIG audit, or watchdog (CMAP, BGA, Illinois
  Answers) publishes an on-schedule delivery percentage for major infrastructure projects.
- `business_survival_rate` — BLS Business Employment Dynamics only publishes 5-year survival tables at
  the national/state level; Census Business Dynamics Statistics' metro file only has coarse age buckets,
  from which a clean survival rate can't be derived without interpolation.
- `apprenticeships` — DOL, Illinois DCEO, Chicago Cook Workforce Partnership, and the Chicago Apprentice
  Network all publish apprenticeship figures, but none at the City of Chicago level (DOL/DCEO data is
  Illinois-statewide — using it would overstate the city figure by roughly 4x).

**Left as an open ResearchTask rather than marked unavailable** (data exists for a narrower/different
scope and might be extendable by a future researcher, unlike the six cases above which were conclusively
ruled out):
- `graduate_employment_rate` — no recurring city-wide figure exists; the only concrete reference point
  is City Colleges of Chicago's one-time 2015 per-campus follow-up study. See
  `chicago-graduate-employment-rate-metric` in the research queue.

**Investigated and confirmed not extendable, no changes made:**
- `clearance_rate` — additional years found were homicide-only or non-fatal-shooting-only clearance
  rates, a narrower category than the existing all-violent-crime clearance data; importing them would
  misrepresent the metric.
- `debt_per_capita` — the two years found (Civic Federation FY2014, FY2023) were already the same two
  years already in the database from an earlier pass; no new years were added.

## Third pass: extending single-year metrics with stable federal/city series (2026-07-31)

The first extended pass added new metrics from scratch; this pass instead targeted 9 metrics that
already had exactly one real/estimated year each, using stable multi-year federal series and the same
per-metric sourcing already established, to extend them across the 2015-2025 range.

**Fully or near-fully resolved:**
- `advanced_manufacturing_employment` — 1/11 -> **11/11 real**. FRED series `SMU17169803000000001A`
  ("All Employees: Manufacturing," Chicago-Naperville-Elgin MSA) has a complete, unbroken annual history;
  the existing 2024 value reproduced exactly, confirming the series.
- `employment` — 1/11 -> **10/11 real**. BLS LAUS series `LAUCT171400000000005`, the sibling series to
  the already-fully-real `unemployment_rate` (`LAUCT171400000000003`). 2025 remains a genuine gap: BLS
  marked October 2025 "unavailable" due to the federal appropriations lapse, so no annual average exists
  yet.
- `labor_force_participation` and `average_commute_minutes` — 1/11 -> **9/11 real each**. Both from ACS
  1-Year Estimates (Tables S2301 and DP03, Chicago city). 2020 is the same permanent COVID-suspension gap
  documented elsewhere on this platform; 2025 is a temporary gap (ACS 1-year estimates lag ~9 months, not
  expected until ~September 2026) — both years added to `unavailableMetrics.ts` rather than left as plain
  placeholders, since they're now confirmed, not just unresearched.

**Partially resolved (real evidence added, but a clean full series wasn't available):**
- `pension_funding_ratio` — 1/11 real -> **4/11 real + 6/11 estimated**. The City's FY2025 ACFR publishes
  individual-fund GASB 68 ratios (MEABF/LABF/PABF/FABF) back to 2016 in its RSI schedule, but only a
  handful of years (2017, 2018, 2025) have a single aggregate figure directly printed by either COFA or
  the ACFR itself. For the other years, this pass computed its own sum-of-assets/sum-of-liabilities
  aggregate from the individually-cited real fund ratios — a transparent, real-data-based calculation,
  labeled `estimated` rather than `government` since it's Mandate's own arithmetic, not a single printed
  figure. **A genuine discrepancy was found and documented, not resolved**: COFA's own printed aggregate
  for FY2023/2024 (24.8%/26.2%) does not match a straight sum-of-assets/liabilities calculation from the
  same underlying fund ratios (~22.6%/25.4%) — both are real and citable, but COFA's exact aggregation
  method could not be determined. Only 2015 remains unfilled.
- `budget_balance` — 1/11 real -> **2/11 real + 6/11 estimated**. 2025 was printed verbatim by the City's
  ACFR; 2018-2023 required summing COFA's separately-reported revenue and expenditure variances against
  budget, using the exact method that reproduces the existing, verified 2024 figure exactly
  (-$378.7M + $217.1M = -$161.6M) — labeled `estimated` for the same reason as above. 2015-2017 remain
  unfilled (not located).
- `startup_formation` — 1/11 real -> **5/11 real**. Census Business Dynamics Statistics (Chicago-Naperville-Elgin
  MSA, firm age 0) added 2019-2022. 2015-2018 exist in the same BDS tool but weren't retrieved this pass
  due to a UI automation limitation (the year-picker control), not a data gap — worth a follow-up attempt,
  or a registered Census API key.
- `skills_training_participation` — 1/11 real -> **4/11 real**. Chicago Cook Workforce Partnership Annual
  Reports added PY2020, PY2021, PY2024 (Adult+Dislocated Worker+Youth registrant sums, same methodology as
  the existing PY2023 value). PY2019 has no archived report; PY2022's report only gives an aggregate
  figure from an image-based PDF with no extractable category breakdown, so it was deliberately left out
  rather than importing a less-certain number.

**Investigated, no defensible extension found:**
- `capital_investment` — stays at 1/11 real. Every other year's OBM Capital Improvement Program figure
  found is a 5-year rolling *planned allocation* total, not a discrete annual figure comparable to the
  existing 2015 datapoint; converting a multi-year total into an annual number would require fabricating
  a split that no source actually provides.

## Fourth pass: retrying stubborn gaps and two never-researched metrics (2026-07-31)

This pass retried metrics where a prior attempt hit a tooling limitation (not a data gap), and formally
investigated two metrics that had never been chased down before.

**Fully or near-fully resolved:**
- `university_spinouts` — 1/11 real -> **11/11 real**. The University of Illinois Chicago's Office of
  Technology Management publishes a clean multi-year startups-formed history (2015-2024); UIC is
  unambiguously Chicago-headquartered, unlike the existing 2025 datapoint (a Northwestern + UChicago
  Polsky Center composite, since Northwestern spans both Evanston and Chicago campuses). **The 2015-2024
  UIC-only figures and the 2025 composite figure use genuinely different methodologies and are not
  directly comparable year-over-year** — documented explicitly in each row's notes rather than blended
  or silently reconciled.
- `startup_formation` — 5/11 -> **9/11 real**. The previous pass's gap (2015-2018) turned out to be a
  UI-automation limitation, not a data gap: Census publishes the full MSA-by-firm-age time series as a
  static downloadable CSV (`bds2023_msa_fac.csv`), independent of the BDS Explorer tool's finicky
  year-picker. 2024-2025 remain unfilled (BDS lags ~2 years behind the present).
- `procurement_timeline_days` — 1/11 estimated -> **11/11 estimated**. The existing 2025 datapoint's own
  source (Chicago Data Portal's Task Order Request dataset) turned out to already contain a live,
  queryable weekly time series back to 2015 — no separate historical source was needed. 2024 shows an
  unexplained ~4x jump over 2023; reported as-is from the live official dataset rather than smoothed.
- `transit_reliability` — 0/11 -> **6/11 real** (2019-2024). A prior pass correctly declined to import
  CTA's "Big Gap Intervals" statistic (an inverse failure-rate, not an on-time percentage). This pass
  found Metra's own On-Time Performance reports publish a genuine, directly-defined, higher-is-better
  on-time percentage — scoped explicitly to Metra (commuter rail), not the combined CTA+Metra+Pace system.
- `vc_investment` — 2/11 estimated -> **6/11 estimated** (2019, 2021, 2022, 2023 added). 2018 and 2020
  were investigated and deliberately excluded: 2018 has two incompatible published figures ($1.9B
  Illinois-statewide vs. an implied >=$3B PitchBook figure), and 2020 has only a rounded "nearly $3
  billion" prose figure with no exact number ever published.
- `bike_infrastructure_miles` — 1/11 -> **2/11 real** (2023 added: "more than 420 miles," CDOT press
  release). The existing 2025 value's press release also mentioned 2025, so no new datapoint existed
  there; 2023 is a genuinely new CDOT-stated figure.

**Confirmed unavailable, added to `unavailableMetrics.ts`:**
- `commercial_rd_investment` — NSF's Business Enterprise R&D (BERD) survey and its predecessor (BRDIS)
  publish no sub-national breakdown finer than state level, for any US metro, not just Chicago. The only
  sub-national figure found (Illinois Science & Technology Coalition's "R&D Index," ~$12-14B/year) is
  Illinois-statewide, a materially different geography, and was not substituted.
- `planning_efficiency_index` — no composite index of this kind exists from Chicago's Department of
  Planning and Development, the Lincoln Institute of Land Policy, or the American Planning Association,
  for Chicago or any city. The real permit/plan-review timing data that would feed such an index already
  fully backs the separate `planning_approval_days` metric (11/11 real).

**Investigated, genuinely unresolvable:**
- `skills_training_participation`'s two remaining gaps (PY2019, PY2022) were retried and confirmed
  unresolvable: PY2019 has no report ever archived anywhere (confirmed via the Wayback Machine's crawl
  index), and PY2022's report contains no extractable category-level breakdown beyond the aggregate
  figure already on file.
