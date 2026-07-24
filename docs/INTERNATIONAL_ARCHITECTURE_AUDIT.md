# International Architecture Audit

**Purpose.** Chicago proved Mandate's methodology works. Greater Manchester proved it survives contact
with a genuinely different governance system — but exposed real architectural seams in doing so. This
document audits the whole system against those seams before deciding what to fix. It is the Phase 1
deliverable of the International Architecture & Research System Hardening Pass; the concrete schema
changes it recommends are implemented and documented separately (`docs/CURRENCY_AND_UNITS.md`,
`docs/JURISDICTION_HIERARCHY.md`, `docs/INSTITUTIONAL_PIPELINE_ARCHITECTURE.md`,
`docs/INTERNATIONAL_SOURCE_HIERARCHY.md`).

## 1. What works well

- **The Source/EvidenceLink/SupportingLegislation model.** Publisher, URL, citation, tier, methodology,
  confidence — none of this needed to change to hold UK sources. It's genuinely jurisdiction-neutral.
- **The 5-stage Institutional Pipeline framework itself.** "Promise → legal authorization → institution
  built → operating → durable" required zero conceptual adaptation for GMCA's bus franchising, housing
  fund, or skills devolution. The stage definitions don't assume US institutions.
- **The 6-level data-quality vocabulary** (government/academic/alternative/estimated/unavailable/
  placeholder). It cleanly separated "the UK's own statutory homelessness data is real but doesn't
  match our metric definition" from "we haven't researched this," which is exactly the distinction a
  second jurisdiction needed to expose as necessary.
- **The self-review guard, external contribution isolation, and Research Passport fields** (researchedBy/
  reviewedBy/reviewedAt/methodologyVersion/nextReviewDate) — built generically, no US-specific
  assumption baked in, required zero changes for Greater Manchester.
- **`Jurisdiction.kind` as a free string, not an enum.** Already flexible enough to hold `"metro_region"`
  alongside `"city"` without a schema change.

## 2. What is US-specific

- The seed's **7-category / 7-PolicyArea taxonomy** (Alternative Crisis Response Program, Progressive
  Revenue Institution, etc.) was designed against US municipal governance concepts. Two of seven have
  no obvious Greater Manchester analogue; a genuinely different country's institutions (e.g. Tokyo's
  ward system, Seoul's directly-elected districts) will likely need categories this taxonomy doesn't
  have, not just missing data within existing ones.
- **48 MetricDefinitions were designed around US data availability** (Census ACS, BLS, HUD PIT counts),
  not around what's universally measurable. `homelessness_count`'s literal "Point-in-Time Count"
  definition is a US HUD concept — most countries don't produce anything structurally equivalent.
- The talent pipeline docs (DePaul/Purdue/Illinois State internal, NYU/Tulane/etc. external) are a
  genuine strength for institutional resilience, not a flaw — but worth naming as a US-centric
  starting point that the external network (already designed to include "international universities")
  is meant to counterbalance.

## 3. What assumes USD

Six `MetricDefinition.unit` values were hardcoded `"usd"` before this pass: `median_rent`,
`median_wages`, `budget_balance`, `debt_per_capita`, `capital_investment`, `vc_investment`,
`commercial_rd_investment`. This wasn't just a display nit — it made it structurally impossible to
import a GBP figure without either mislabeling it as dollars or fabricating a currency conversion
Mandate has no defensible methodology for. This is fixed this pass (`docs/CURRENCY_AND_UNITS.md`).

## 4. What assumes calendar years

The import pipeline's `periodType` only understood `"year"` (Jan-Dec), `"quarter"`, `"month"` before
this pass — no representation for the fiscal-year (Apr-Mar) or academic-year (Aug-Jul) conventions that
UK government statistics are natively published in. Fixed in the Greater Manchester pass
(`uk_fiscal_year`, `uk_academic_year` period types) and re-verified this pass (Phase 3).

## 5. What assumes a single municipal government

`Jurisdiction` had no self-relation before this pass — every jurisdiction was a flat, independent row.
Greater Manchester was already correctly modeled as one metro-level row (not forced into "Manchester
City Council"), but the schema had no way to express "this jurisdiction is a metro area made of ten
boroughs" even if a future pass wanted to add the boroughs. Fixed this pass with an optional
`parentJurisdictionId` self-relation and `administrativeLevel` field (`docs/JURISDICTION_HIERARCHY.md`)
— additive, populates nothing new, just makes the hierarchy representable when real research needs it.

## 6. What assumes a single institution per policy area

`PipelineAssessment` enforced one "current" row per (jurisdiction, policyArea) pair. Greater
Manchester's affordable-housing capacity genuinely rests on at least three real institutions (GMHILF,
the Brownfield Fund, Places for Everyone) that don't collapse into one linear history. Fixed this pass
with an additive `institutionName` field and a relaxed unique constraint
(`docs/INSTITUTIONAL_PIPELINE_ARCHITECTURE.md`) — the scoring methodology itself is unchanged.

## 7. What assumes US-style government data

US federal/state/city agencies publish granular, well-documented, frequently-updated open data
(Census, BLS, HUD, city open-data portals) as a matter of course. The audit found UK equivalents exist
but differ structurally: MHCLG publishes financial-year live tables with borough-level detail but no
combined-authority rollup (Mandate had to sum ten boroughs itself); ONS/Nomis serves modeled estimates
with their own discontinuity notices (the 2024-25 unemployment "suspended pending reweighting" caveat);
DfE's apprenticeship data required reconstructing two years from LA-level pivot tables because no
official regional aggregate existed that far back. None of this broke Mandate's architecture — the
`notes`/`limitations` fields absorbed all of it — but it confirms government data granularity and
structure vary by country in ways no schema field can paper over; only researcher judgment can.

## 8. What assumes US-style sources

Before this pass, `Source` had no way to record which country a publisher belongs to or what language
it publishes in — every source was implicitly assumed domestic and English. Fixed this pass with
optional `country`/`language` fields (`docs/INTERNATIONAL_SOURCE_HIERARCHY.md`), backfilled for the 16
real UK sources already in the registry.

## 9. What assumes English-language sources

Nothing in the schema enforces this, but nothing supported recording otherwise either (see #8). No
non-English source has been researched yet, so this remains theoretical: the `language` field now
exists, but Mandate has no tested experience with a source published in Japanese, Korean, or another
non-English language — translation/citation conventions for those are unaddressed and should be
expected to raise new questions the first time they're actually needed, not solved speculatively now.

## 10. What will break when adding Europe

Likely little, based on the Greater Manchester experience: EU/EEA countries mostly share the fiscal/
calendar-year distinction UK-style, Eurostat-style statistical agencies resemble ONS/MHCLG in
government-data structure, and EUR is now representable via `currencyCode`. The main real risk is the
PolicyArea taxonomy — a European jurisdiction's institutions (e.g. a German Land's devolved powers, a
French intercommunalité) will likely need categories closer to Greater Manchester's devolution/skills/
transport set than to Chicago's US-specific ones, reinforcing #2 above rather than introducing a new
problem.

## 11. What will break when adding Asia

More genuinely untested territory: (a) non-Latin-script sources and potential non-English-only
publications (see #9); (b) currencies with no minor unit (JPY, KRW) — `Intl.NumberFormat`'s
`style: "currency"` already handles this correctly (0 fraction digits for JPY/KRW is standard
behavior), so no code change is needed, but this hasn't been exercised with a real JPY/KRW value yet;
(c) administrative structures that don't resemble either the US or UK model at all — Tokyo's 23 special
wards plus surrounding cities/towns/villages under one metropolitan government, or Seoul's districts
(gu) under one metropolitan city, will stress-test the new `parentJurisdictionId`/`administrativeLevel`
fields for the first time with a real (not just hypothetical) hierarchy. See Phase 12's stress test
below for a fuller treatment.

## 12. What will break when adding countries with different administrative structures

The new `administrativeLevel` field is deliberately a free string, not an enum, precisely because no
fixed ladder (Country → Region → Metro → Municipality → District) universally applies — Singapore is a
single-level city-state with no sub-national government at all; Tokyo has both special wards (with
their own elected mayors and assemblies, closer to municipalities) and a metropolitan government layer
above them; Greater Manchester's ten boroughs report to a combined authority that itself sits inside
England's non-federal unitary state. The field's flexibility is intentional, but it also means nothing
in the schema enforces a valid hierarchy shape — that responsibility stays with researchers and
documentation, not a database constraint. This is a deliberate simplicity trade-off, not an oversight.

## 13. What will break when adding metro governments

Handled by #5/#11 above (the `parentJurisdictionId` self-relation) at the schema level. The **remaining**
gap is entirely on the client/UI side: no page currently renders a jurisdiction's children, shows a
"part of X metro area" breadcrumb, or aggregates a metro-level view from constituent rows — because no
jurisdiction currently has children to render. This is honestly listed as unbuilt (not silently
assumed away) in `docs/JURISDICTION_HIERARCHY.md`.

## 14. What will break when adding borough-level or district-level data

The exact scenario Greater Manchester already surfaced and this pass deliberately did NOT solve by
populating real borough rows (see `docs/GREATER_MANCHESTER_CASE_STUDY.md`): all of Mandate's imported
GM housing/homelessness data exists at borough grain in the *source* (MHCLG publishes it that way) but
was summed into one GM-total figure before import, because no borough-level Jurisdiction rows exist to
hold the disaggregated numbers. The schema capability now exists (`parentJurisdictionId`); the actual
work of creating ten borough rows, deciding their GovernanceModel linkage, and re-importing at that
grain is real future work, correctly not done speculatively.

## 15. What will break when multiple institutions address the same policy area

This is #6 above, restated as a forward-looking risk: the schema fix (`institutionName`) exists, but
**no client UI renders multiple institutions under one policy area yet** — `getJurisdictionPipeline()`
still returns one row per policy area for every real jurisdiction today (all use the default `""`
institution), so the Place Profile page's one-card-per-policy-area grid has never been tested against
a policy area with two or three real concurrent institutions. The first time a researcher actually
populates a second named institution under an existing policy area, expect to need a UI change (a
policy-area card that expands into multiple institution sub-cards) that hasn't been built yet — flagged
honestly in `docs/INSTITUTIONAL_PIPELINE_ARCHITECTURE.md` as deferred, not solved.
