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
- **100% Business Rates Retention Pilot** (2017/18-2019/20) — a candidate for "Progressive Revenue
  Institution," but not researched deeply enough this pass to score responsibly. Flagged as a
  ResearchTask (`gm-business-rate-retention-pipeline`) rather than guessed at.

Four of Greater Manchester's seven PolicyAreas remain the synthetic placeholder generator's output,
unresearched this pass: Public Innovation & Startup Investment Vehicle, Permitting & Procurement
Modernization (a stretch even for Places for Everyone — see below), Alternative Crisis Response Program
(no comparable non-police crisis-response institution was identified, but this was not dedicated
research, just an absence of a candidate), and Progressive Revenue Institution (pending the Business
Rate Retention research task).

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
