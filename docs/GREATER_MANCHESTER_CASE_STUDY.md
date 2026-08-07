# Greater Manchester Case Study

**Purpose of this document.** Chicago is Mandate's reference implementation — the jurisdiction where the
research-grade methodology (source hierarchy, evidence links, the 5-stage Institutional Pipeline, the
6-level data-quality vocabulary) was built and proven. This document records what happened when that
same methodology was pointed at a genuinely different governance environment for the first time:
Greater Manchester, England. It is written for a future Mandate researcher who has never met the
founder and needs to understand not just what data exists for Greater Manchester, but why the
architecture handled some of it cleanly and struggled with the rest.

## Why Greater Manchester

Mandate's stated ambition is to become a general institutional measurement system, not a Chicago
tracker with other cities bolted on. The only way to find out whether the architecture actually
generalizes is to point it at a jurisdiction that differs from Chicago on the dimensions that matter
most: a different country, a different currency, a different unit of government (a combined authority
of ten historically independent boroughs, not a single city), a different legal/statistical system, and
an active, still-unfolding institutional transformation (bus franchising) with a genuinely contested
independent evaluation record — not a settled, retrospective case. Greater Manchester offers all of
these in one jurisdiction, which is why it was chosen over other devolved English city-regions.

## Institutional structure: GMCA vs. Manchester City Council

The single most important fact of this whole pass: **Greater Manchester is not a city in the sense
Chicago is.** It is a combined authority — ten historically independent metropolitan boroughs (Bolton,
Bury, Manchester, Oldham, Rochdale, Salford, Stockport, Tameside, Trafford, Wigan) that pool specific
strategic powers (transport, housing investment, skills, some health and social care functions) under a
directly-elected Metro Mayor (Andy Burnham since May 2017), while each borough retains its own
council, its own local services, and its own separate planning authority for most day-to-day matters.

Every real institution researched in this pass — the Bee Network bus franchise, the Housing Investment
Loans Fund, the devolved Adult Education Budget — is a **GMCA-level** power, not something Manchester
City Council does on its own. Scoring any of these against "Manchester City Council" (the single-borough
government) would have been a real category error: GMCA is the actual policy actor, and Manchester
City Council is simply the largest of its ten constituent members. Mandate's existing seed data already
modeled Greater Manchester correctly before this pass began — a single `Jurisdiction` row with
`kind: "metro_region"`, named "Greater Manchester Combined Authority," distinct from any individual
borough — and this pass confirmed that was the right call by finding that every real pipeline
researched genuinely operates at that level.

**Places for Everyone**, researched but not scored under any PolicyArea this pass, complicates this
picture further: it is a *joint* spatial development plan adopted by nine of the ten boroughs acting
together (Stockport opted out) — neither a GMCA-wide power nor a single-borough one, but something in
between. See "What Mandate's architecture struggled with" below.

## Governance boundaries and geography

For the metrics actually imported this pass (unemployment, employment, apprenticeships, housing and
affordable housing completions), the ONS/Nomis "Greater Manchester" combined-authority geography code
(E47000001) and the DfE "Greater Manchester" English Devolved Area code were both confirmed to match
the same ten-borough boundary as the GMCA jurisdiction — no boundary mismatch was found. This should
not be assumed to hold for every future UK statistical series; it was verified specifically for the
series imported here.

## Major institutional pipelines researched

Full evidence, sources, and conservative stage reasoning live in
`server/prisma/seed/data/greaterManchesterResearchedPipeline.ts`. Summary:

| Pipeline | Institution | Stage | Why not higher |
|---|---|---|---|
| Transit Network Expansion Program | Bee Network bus franchising | **4** | Only ~1 year of full-network data; an academic source (with a disclosed TfGM/DfT funding relationship) finds benefits concentrated in central Manchester with peripheral boroughs still underserved; a bus-operator trade body's rising-cost claim (£227m/year) is unverified; rail integration under the same brand remains stage 1-2 |
| Affordable Housing Production Institution | Greater Manchester Housing Investment Loans Fund (GMHILF) | **4** | The only independent evaluation was reactive (commissioned after media/political pressure, not routine); GMCA's "11,000 homes" claim doesn't reconcile with the independent ~7,800-completed figure; funding found heavily concentrated toward one developer and central Manchester |
| Workforce Development Institution | Devolved Adult Education Budget / Adult Skills Fund | **4** | GMCA's own commissioned independent evaluators (IES, 2023) explicitly stated robust outcome/impact evidence does not yet exist — this is the single most load-bearing fact in the whole pipeline's scoring |
| Alternative Crisis Response Program | Right Care, Right Person / Mental Health Tactical Advice Service (MHTAS) | **3** | GMP excluded from the only independent national evaluation (GOV.UK, Dec 2024); a July 2025 coronial Prevention of Future Deaths report documents a live, unresolved safety controversy with the GM implementation |
| Public Innovation & Startup Investment Vehicle | GC Angels / The Enterprise Fund Limited | **4** | Portfolio-count/capital-mobilized figures vary meaningfully across independent trackers (27-49 companies depending on source); no source demonstrates improving outcomes over time, only cumulative totals |

Three real GM institutions were researched but **deliberately not modeled as separate PipelineAssessment
rows**, because Mandate's schema only supports one "current" institution per (jurisdiction, policyArea)
pair, and none of the three cleanly substitutes for or supersedes the ones scored above:

- **GM Brownfield Housing Fund** (stage 3 by this research's own assessment) — real disbursements
  against named schemes (e.g. a Feb 2021 £15.8m MHCLG tranche, a 2024 £500m scheme requiring a CMA
  Subsidy Advice Unit review), but almost every public "homes delivered" figure found is a
  funding-tranche target, not a confirmed completion count.
- **Places for Everyone** (arguably stage 4 in its own right) — formally adopted 21 March 2024, and
  in real, documented use in individual borough planning decisions through 2025 (e.g. Bolton MBC
  committee reports citing specific PfE policies). This is the single institution this pass most
  regrets not having a clean home for — see "What Mandate's architecture struggled with."
- **100% Business Rates Retention** — researched in full during the flagship-case-study pass (see below):
  a real, well-evidenced, Stage-4-worthy fiscal-devolution institution on its own terms, but confirmed to
  be a genuine category mismatch for "Progressive Revenue Institution" (see "Dead ends" below).

Of Greater Manchester's seven PolicyAreas, five are now researched with real evidence (Transit, Housing,
Workforce, Alternative Crisis Response, Public Innovation). **Permitting & Procurement Modernization**
remains the synthetic placeholder generator's output — the one candidate investigated (Places for
Everyone) was found to be a genuine taxonomy mismatch and is documented above instead; whether a
different, genuinely-fitting GM institution exists remains open. **Progressive Revenue Institution** is
no longer an unresearched gap — it now carries a deliberate, evidenced "no clean fit" finding (see
"Dead ends," below) rather than a synthetic placeholder.

## Data challenges

- **Currency.** Mandate's `median_rent`, `median_wages`, `budget_balance`, `debt_per_capita`,
  `capital_investment`, and `vc_investment` metric definitions all hardcode `unit: "usd"` — not a
  currency-agnostic unit. Importing GBP-denominated data under these metrics would either silently
  mislabel pounds as dollars, or require a currency-conversion estimate Mandate has no defensible
  methodology for yet. This pass avoided every currency-denominated metric entirely for Greater
  Manchester rather than compromise on either front — see "What Mandate's architecture struggled with."
- **Fiscal/academic years, not calendar years.** UK government statistics are natively fiscal-year
  (Apr-Mar, MHCLG) or academic-year (Aug-Jul, DfE) — never calendar-year. Mandate's import pipeline
  previously only understood calendar years, which would have forced every UK date into the wrong
  3-6 month window. Fixed this pass (see "What Mandate learned" below) rather than worked around.
- **Definitional incompatibility, not just missing data.** Two metrics were investigated and
  deliberately NOT imported despite real data being available, because the available UK data measures
  something genuinely different from what Mandate's metric definition means:
  - `homelessness_count` is defined as a Point-in-Time Count. The closest UK equivalent is MHCLG's
    annual Rough Sleeping Snapshot (a single-night visible count) — but this pass instead researched
    MHCLG's much larger "statutory homelessness" series (households assessed as owed a legal duty),
    which is a different population entirely. That real, verified data is preserved below for a future
    researcher, but was not imported under the existing metric slug — see the ResearchTask
    `gm-homelessness-metric-methodology` for the decision this leaves open.
  - `violent_crime_rate`/`property_crime_rate` are defined against US UCR categories. UK Home Office
    "violence against the person" is not the same population as US "aggravated assault" (it includes
    materially lower-severity incidents) — this pass's crime research was left incomplete and is now a
    ResearchTask (`gm-crime-rate-metrics`) rather than a rushed, poorly-mapped import.
  - `planning_approval_days` is defined in literal days. MHCLG reports planning-decision timeliness as
    "% of applications decided within 8/13 weeks" — a percentage, not a day count. Not imported this
    pass (already flagged in the pre-existing `imports/data/housing/greater-manchester.csv` template,
    which correctly anticipated this before this pass began).

### Raw data gathered but not imported (for a future researcher)

MHCLG statutory homelessness (households owed a prevention or relief duty; **not** a rough sleeping
count — see above), GM total by financial year, summed across the 10 boroughs:

| FY | GM total | Notes |
|---|---|---|
| 2014-15 | 2,447 | Pre-Homelessness Reduction Act 2017 series ("main duty acceptances," Table 784) |
| 2015-16 | 2,653 | Pre-HRA |
| 2016-17 | 3,142 | Pre-HRA |
| 2017-18 | 3,428 | Pre-HRA — **not comparable** to the post-2018 rows below (MHCLG's own discontinuity note) |
| 2018-19 | 16,600 | Post-HRA "owed a duty" series, Table A1; all 10 boroughs reported |
| 2019-20 | ~16,847 (Wigan suppressed) | Post-HRA |
| 2020-21 | 18,455 | Post-HRA; all 10 boroughs reported |
| 2021-22 | 20,347 | Post-HRA; all 10 boroughs reported |
| 2022-23 | 22,277 | Post-HRA; all 10 boroughs reported |
| 2023-24 | ~20,540 (Salford suppressed) | Post-HRA |
| 2024-25 | ~19,399 (Bury, Tameside suppressed) | Post-HRA |

(Per-borough detail is in the underlying research; totals above are approximate where MHCLG suppressed
individual borough cells for missing data — do not treat suppressed cells as zero.)

## What Mandate learned

1. **The jurisdiction abstraction was already right for combined authorities.** No schema change was
   needed to represent GMCA as its own top-level jurisdiction, distinct from any single borough. This
   validates a design decision made before this pass, not something this pass had to fix.
2. **The import pipeline assumed calendar years globally.** Fixed additively this pass: added
   `uk_fiscal_year` and `uk_academic_year` as new `periodType` values (`server/src/import/types.ts`,
   `validators.ts`), plus a `--period-type` CLI flag. No existing calendar-year data was touched.
3. **The synthetic placeholder generator had no concept of "real data already exists under a different
   period convention."** Before this was fixed, importing GM's fiscal-year housing data created 33
   duplicate calendar-year placeholder rows sitting alongside the real ones — silently regenerated on
   every reseed. Fixed by having the seed script check, before generating any placeholder, whether a
   (metric, jurisdiction) pair already has any real (non-placeholder, non-unavailable) data under any
   period type, and skipping generation entirely if so (`server/prisma/seed/index.ts`, mirrors the
   existing pattern already used to skip synthetic PipelineAssessment generation for researched pairs).
4. **The PolicyArea taxonomy is more Chicago/US-shaped than it first appears.** "Alternative Crisis
   Response Program" and "Progressive Revenue Institution" don't have obvious Greater Manchester
   analogues (a real candidate exists for the latter — the Business Rate Retention Pilot — but wasn't
   researched deeply enough to score). More importantly, "Permitting & Procurement Modernization" is a
   real stretch for the most obviously GM-relevant institution in that neighborhood, Places for
   Everyone, because that policy area's framing (individual permit/procurement process reform) doesn't
   describe what a joint regional spatial plan actually is.
5. **The one-current-institution-per-policy-area model is a real limitation, not just a GM quirk.**
   Greater Manchester's affordable-housing capacity rests on at least three simultaneous institutions
   (GMHILF, the Brownfield Fund, Places for Everyone) that don't collapse into one linear history the
   way Chicago's single Department of Housing does. This wasn't visible as a limitation until a second,
   institutionally pluralistic jurisdiction was tried.

## What Mandate's architecture handled well

- The `Source`/`EvidenceLink`/`SupportingLegislation` model needed zero changes — UK sources (ONS,
  MHCLG, GMCA, NAO, academic, journalism) slotted into the existing tier vocabulary and citation fields
  without friction.
- The 5-stage Institutional Pipeline framework itself required no adaptation — "policy proposal →
  legal authorization → institution created → operating with outputs → institutionalized" mapped
  cleanly onto all three GM institutions researched, including the judgment call that bus franchising
  (a complete, independently-authorized transformation of the dominant transit mode) deserved stage 4
  on its own merits, separately from rail integration under the same brand, without artificially
  averaging the two together.
- The self-review guard, external contribution workflow, and admin write paths (built earlier this
  session, not GM-specific) required zero changes to work for a non-US jurisdiction — none of that
  machinery has any US-specific assumption baked in.

## What Mandate's architecture struggled with

1. **Currency-denominated metrics cannot honestly be used for a non-USD jurisdiction yet.** `unit:
   "usd"` is hardcoded on six metric definitions. This blocked importing `median_rent`, `median_wages`,
   and every fiscal-health metric for Greater Manchester, not because the data doesn't exist (it does —
   ONS/VOA private rental market statistics, for instance), but because there is currently no honest way
   to store a GBP figure under a metric whose unit field literally says "usd." **P1.**
2. **One current institution per (jurisdiction, policyArea) pair.** As above — Greater Manchester's
   housing capacity is genuinely pluralistic. **P1.**
3. **No sub-jurisdiction hierarchy.** Some real GM data (all three imported housing/homelessness series)
   is only published at the individual-borough level, and Mandate currently has no way to represent "one
   of ten boroughs within Greater Manchester" — only a single flat GM jurisdiction row. This pass worked
   around it by importing GM-total (summed) figures, which is honest and defensible for GMCA-level
   institutions (the actual policy actors researched here operate at that level), but a future pass
   wanting borough-level detail (e.g., "how much of GM's housing delivery is concentrated in Manchester
   versus Wigan") would need real schema work. **P2** (a genuine limitation, but not blocking this
   pass's actual research questions, all of which were correctly GMCA-level).
4. **PolicyArea is a single global taxonomy.** Adding a jurisdiction-specific category (e.g., "Regional
   Spatial Planning" for Places for Everyone) would affect every jurisdiction's coverage denominators,
   not just Greater Manchester's — a decision this pass deliberately left to a methodology_lead/admin
   rather than making unilaterally. **P1.**

See `docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md` for the full P0-P3 ranking and what's recommended
before expanding to a third jurisdiction.

## What should change before expanding to more metropolitan regions

In priority order: (1) decide on a currency-representation fix (likely a `currencyCode` field on
`MetricValue` or `MetricDefinition`, defaulting to `"USD"` for existing rows, additive and
backward-compatible) before any future jurisdiction with non-USD currency metrics; (2) decide whether
`PipelineAssessment` should support multiple concurrent institutions per (jurisdiction, policyArea) —
even a simple additive `label`/`institutionName` field distinguishing rows at the same current date
might be enough, without a full redesign; (3) resolve the Places for Everyone taxonomy question
(new PolicyArea vs. force-fit) as a real methodology decision, not a default; (4) only then consider
sub-jurisdiction hierarchy (borough-level rows), since it's the most architecturally invasive of the
four and wasn't actually blocking anything this pass needed.

*(Note: `PipelineAssessment` gained an additive `institutionName` field since this section was
originally written, addressing point (2) above.)*

## Flagship-case-study pass (2026-08-07): fixing a real overclaim, closing three pipeline gaps

Greater Manchester was elevated from "second research jurisdiction" to Mandate's flagship international
case study, with an explicit brief: prioritize institutional-pipeline depth and high-confidence
government metrics over raw coverage percentage, and research first, implement only once evidence
quality is verified. The audit that opened this pass found something that needed fixing immediately:

**A real overclaim, caught and corrected.** `alternative-crisis-response` carried a synthetic
placeholder claiming **Stage 4** ("established track record with measurable, improving outcomes over
multiple years") on `dataQuality: "placeholder"` — i.e., a random value from the seed generator that
happened to look like a real, confident assessment. This is exactly the failure mode Mandate's
data-quality model was built to prevent, and it had gone unnoticed because the row's placeholder status
was only visible by querying the database directly, not from the UI's default display. Real research
(below) replaced it with a conservative Stage 3.

### Pipeline research completed this pass

**Alternative Crisis Response Program → Right Care, Right Person / MHTAS (Stage 3).** No GM equivalent
of US CAHOOTS/STAR/CARE-style dedicated field units exists. What's real: the Mental Health Tactical
Advice Service (MHTAS, a four-way GMP/NHS partnership running since 2018) and Right Care, Right Person
(RCRP, a national call-triage/diversion policy GMP implemented GM-wide on 30 September 2024). Capped at
Stage 3 rather than 4 because GMP was explicitly excluded from the only independent national process
evaluation (GOV.UK, Dec 2024), and a July 2025 coronial Prevention of Future Deaths report documents a
live, unresolved safety controversy with a GM RCRP-related case. Serenity Integrated Mentoring (SIM), a
nationally-controversial scheme sometimes assumed to operate in GM, is confirmed **not** in use here —
Health Innovation Manchester's own page states this directly.

**Public Innovation & Startup Investment Vehicle → GC Angels / The Enterprise Fund Limited (Stage 4).**
GC Angels, delivered by an FCA-regulated Growth Company subsidiary, has a genuine recurring GMCA funding
relationship (a 28 March 2025 decision awarding £1m of Retained Business Rates funding for FY2025-26)
and 6+ years of independently-corroborated (if imprecisely counted across trackers) investment activity.
Northern Gritstone — a university-spinout fund GMCA put a one-off £1.5m into among a dozen+ other
backers, with no board seat or governance role — is a confirmed dead end for this category: a private
vehicle GMCA co-invested in, not a GMCA institution.

**Progressive Revenue Institution → deliberate "no clean fit" finding (dataQuality: "unavailable").**
GM's one genuine, well-evidenced revenue institution — 100% Business Rates Retention, permanent since
1 April 2024, funding a ~£2bn investment vehicle — redistributes revenue *between tiers of government*
(central to local), not *between income groups*. UK local government structurally lacks a US-style
progressive tax institution: council tax is a flat banded property tax, and there is no local income
tax. Every genuinely redistributive/equity-framed revenue tool GM considered — the 2008 congestion
charge (rejected 78.8% in referendum), the 2018 workplace parking levy (rejected by council leadership),
the 2022 charging Clean Air Zone (approved then scrapped before charging a single driver) — died before
collecting any revenue. This is recorded as a deliberate research conclusion, not an unresearched gap.

**Permitting & Procurement Modernization → still open.** The one candidate investigated (Places for
Everyone) was confirmed to be a genuine taxonomy mismatch (see below) rather than a fit for this
category. Whether a different, genuinely-fitting GM institution exists (e.g., a building-permit or
business-licensing digitization program distinct from spatial planning) was not searched for this pass
and remains open.

### Two architectural recommendations, grounded in this pass's evidence, awaiting methodology-lead sign-off

Both of the following are genuine taxonomy gaps surfaced by real research, not speculative
redesign — but both are global changes affecting every jurisdiction's coverage denominators, so neither
was implemented unilaterally:

1. **A new "Regional Spatial Planning" PolicyArea.** Places for Everyone (the 9-borough joint spatial
   plan, formally adopted 21 March 2024, already reshaping real planning decisions — e.g. Bolton's
   Policies Map amendment and a granted first-phase permission at West of Wingates) is not a permitting
   or procurement reform; it is a strategic multi-jurisdiction land-use allocation instrument. No
   existing PolicyArea holds this cleanly. A dedicated category would also cleanly hold analogous
   instruments in other combined authorities (e.g., any future West Yorkshire or West Midlands joint
   plans), making it a genuinely reusable addition, not a one-off special case for GM.
2. **Reframe "Progressive Revenue Institution" for non-US jurisdictions** (e.g., to "Fiscal Devolution
   Institution"), or explicitly document that some jurisdictions structurally cannot have a "progressive"
   revenue institution in the US sense. This would let GM's real, Stage-4-worthy Business Rates
   Retention institution be scored honestly on its own terms instead of living as a permanent
   "unavailable" entry under a category it can never satisfy.

### Metrics feasibility audit (research only — no data imported yet)

A systematic check of GM's ~35 unresearched metrics against ONS, Nomis, GMCA, DfT, MHCLG, and NHS
England found:

- **~19 metrics GREEN** (a genuine, named statistical product exists at Greater Manchester geography or
  cleanly aggregates from GM's 10 boroughs) — e.g., `startup_formation`/`business_formation`/
  `business_survival_rate` (ONS Business Demography), `tech_employment`/`life_sciences_employment`/
  `advanced_manufacturing_employment` (Nomis BRES), `violent_crime_rate`/`property_crime_rate`/
  `clearance_rate` (ONS/Home Office, Greater Manchester Police force area — a clean geography match),
  `transit_ridership`/`transit_reliability` (TfGM/GMCA direct reporting), `median_wages` (ONS ASHE),
  `budget_balance`/`debt_per_capita`/`capital_investment`/`capital_budget_execution_rate` (MHCLG).
- **~11 metrics YELLOW** (real data exists but needs aggregation judgment, has a methodological caveat,
  or comes from irregular project-tracking reports rather than a fixed annual table) — e.g.
  `university_spinouts` (HESA HE-BCI, requires deciding which GM-based providers "count"),
  `commercial_rd_investment` (ONS BERD's ITL2 tables are explicitly experimental), `average_commute_minutes`
  (would need modeling from Census distance/mode bands, no single published "average minutes" figure).
- **~7 metrics RED** (structural dead ends, not just unresearched) — most importantly `bond_rating_index`:
  **not a data-availability gap but a conceptual mismatch** — UK combined authorities/councils are not
  routinely credit-rated by Moody's/S&P/Fitch the way US municipalities are, so this metric is structurally
  N/A for GM rather than merely hard to find. Also `procurement_timeline_days`, `agency_vacancy_rate`,
  `digital_government_adoption`, `ai_companies`, `patent_creation` below ITL2 geography, and `commercial_rd_investment`
  at anything finer than experimental ITL2 — all the same categories of dead end already documented for
  Chicago, for the same underlying reasons (no such statistic is published at this geography by anyone,
  for any UK combined authority, not just GM).

**Two GM-specific structural notes for future metric definitions:** `emergency_response_minutes` is
NHS England ambulance data (reportable at NHS Greater Manchester Integrated Care Board level), not
fire/police response as typically modeled for US jurisdictions — worth a definitional footnote on the
metric itself. And the GREEN list flagged two likely internal duplicates for the schema team to resolve
before pulling data: `startup_formation`/`business_formation` (same ONS Business Demography series), and
`permit_approval_days`/`planning_efficiency_index` (both likely re-derivable from the same MHCLG "speed
of decision" tables already backing Housing's `planning_approval_days`).

**Next step, not yet done:** pull real values for the ~19 GREEN metrics. Per this pass's "research
first, implement only once verified" brief, that is deliberately a separate, subsequent phase — this
audit is a feasibility map, not a data pull.

**Minor UI observation, not fixed this pass:** the progressive-revenue-institution "unavailable" entry
displays as "0/5 · Campaign Promise" in the Pipeline Detail Page's stage badge, since stage 0's label is
hardcoded to "Campaign Promise" regardless of `dataQuality`. This reads oddly for a deliberate
"confirmed no institution of this kind exists" finding (which isn't a promise at all) — the page's
"Unavailable" data-quality badge and neutral-summary text both communicate the real finding correctly,
so this is a cosmetic label mismatch, not a data or methodology problem. Worth a small UI fix (e.g., a
stage-0-plus-unavailable-specific label) if this combination recurs for other jurisdictions.
