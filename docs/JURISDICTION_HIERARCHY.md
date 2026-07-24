# Jurisdiction Hierarchy

**Problem this solves.** Greater Manchester is not "a city" the way Chicago is — it's a combined
authority of ten historically independent boroughs. Mandate's seed data already made the right call
(one `Jurisdiction` row for the metro-level GMCA, not one forced into "Manchester City Council" — see
`docs/GREATER_MANCHESTER_CASE_STUDY.md`), but the schema had no way to represent the boroughs
*underneath* it even if a future pass wanted to. This document designs and implements the minimum
additive fix.

## Design principle: do not copy the US Census hierarchy

The task brief suggested `Country → Region → Metro Area → Municipality → District` as an example — and
explicitly warned not to assume every country follows it. It doesn't:

- **Singapore** is a single-level city-state: no region, no metro area, no sub-municipal district with
  its own government (Community Development Councils exist but aren't a jurisdiction of government in
  Mandate's sense).
- **Tokyo** has 23 special wards (each with its own elected mayor and assembly — closer to
  "municipality" than "district") plus a metropolitan government layer above them, plus surrounding
  cities/towns/villages that are NOT special wards — a shape with more than one kind of child under one
  parent, not a single clean ladder.
- **Seoul** is a metropolitan city containing autonomous districts (gu), which is structurally closer
  to Greater Manchester (metro → boroughs) than to a US city → county → state ladder.
- **Greater Manchester itself**: Country (UK) → Region (North West England, not itself a jurisdiction
  Mandate models) → Combined Authority (GMCA) → Borough — a 3-tier real hierarchy, but the "Region"
  level is a statistical/cultural label, not a unit of government with its own budget or elected leader,
  so it's deliberately NOT modeled as a `Jurisdiction` row at all.

A single fixed enum ladder would be wrong for at least three of these four real examples. The fix is a
flexible, arbitrary-depth self-relation instead.

## What was implemented

Two new fields on `Jurisdiction`, both nullable/optional — fully additive, zero backfill required:

```prisma
parentJurisdictionId String?   // self-relation FK, onDelete: SetNull
administrativeLevel  String?   // free text, data-driven like `kind` — NOT an enum
```

- **`parentJurisdictionId`**: a genuine self-relation (`Jurisdiction? @relation("JurisdictionHierarchy", ...)`
  plus the inverse `childJurisdictions Jurisdiction[]`). NULL means "no parent modeled" — true of every
  jurisdiction today, including Greater Manchester, which remains one flat row.
- **`administrativeLevel`**: a free-text classification (`"municipality"`, `"metro_region"`, `"borough"`,
  `"district"`, `"country"`, etc.) — deliberately not a fixed enum, for the reason above. NULL means
  "not yet classified," not an implied default.

Both fields are pure annotations. **Nothing currently reads them** — no query aggregates a parent's
metrics from its children, no page renders a "part of X" breadcrumb, no coverage calculation treats a
child's data as contributing to its parent's. This is intentional: the capability now exists in the
schema, but building the actual rollup/UI logic before any jurisdiction has real children to roll up
would be speculative work with no way to verify it's correct. See "What's deliberately not built" below.

## How metrics should behave under a hierarchy (design, not yet exercised)

Four cases the schema needs to support, reasoned through even though none has real data yet:

1. **A metric belongs to the metro level** (e.g. Bee Network ridership, devolved AEB enrollment) — the
   `MetricValue.jurisdictionId` simply points at the metro-level row, exactly as Greater Manchester's
   real metrics do today. No hierarchy involvement needed.
2. **A metric belongs to one municipality** (e.g. a single borough's own council-tax rate) — once
   borough rows exist, `jurisdictionId` points at that borough, with `parentJurisdictionId` on the
   borough row identifying which metro area it belongs to. Nothing new needed once the rows exist.
3. **A metric aggregates multiple municipalities** — this is exactly what Greater Manchester's
   `housing_completions`/`affordable_housing_completions` already do today: MHCLG publishes by-borough,
   Mandate sums to a GM total and imports ONE row against the metro-level jurisdiction, with `notes`
   documenting the aggregation ("GM total = sum of 10 constituent boroughs..."). This pattern doesn't
   require the hierarchy fields at all — it's a research-time aggregation decision, done by a human,
   documented in `notes`. The hierarchy fields would only matter if Mandate later wanted to
   automatically re-derive the metro total FROM stored borough-level rows instead of importing a
   pre-summed figure — a genuine future option, not needed today.
4. **A metric comes from a national source / is only available regionally** — no special handling
   needed: it's simply a `MetricValue` row against whichever `Jurisdiction` is the right unit of
   analysis for that source's granularity (a country-level row, if one existed, or the metro/
   municipality row with a `notes` caveat that the figure is a national or regional average being used
   as a local proxy).

## What's deliberately NOT built this pass

- **No borough-level `Jurisdiction` rows for Greater Manchester.** All ten boroughs' real data was
  imported at the GM-total (summed) level this pass — correct, since GMCA is the actual policy actor
  for every institution researched (Bee Network, GMHILF, devolved AEB). Creating ten new rows now, with
  no immediate research need for borough-level granularity, would inflate the Research Map's coverage
  denominators for a jurisdiction nobody is currently researching at that grain.
- **No automatic parent/child rollup logic.** Whether a parent's Research Map coverage should ever
  include or exclude its children's data is a genuine methodology question (does GMCA's own coverage
  percentage change if Manchester borough gets its own row?) that shouldn't be decided by an unused
  schema field's side effects — it should be decided explicitly, the first time it's actually needed.
- **No client UI for rendering a jurisdiction's children** (a "constituent boroughs" list, a "part of X
  metro area" breadcrumb). Nothing to render yet since no jurisdiction has children.
- **No enum/constraint on `administrativeLevel`.** Deliberately free text — seeding it with a fixed
  list of valid values now, before Singapore/Tokyo/Seoul-shaped real data exists to validate the list
  against, risks getting the taxonomy wrong and having to migrate it later. Free text costs nothing and
  can be tightened once real examples justify a specific vocabulary.

## Verification

- Migration is purely additive (two nullable columns, one new index, one new FK constraint with
  `onDelete: SetNull`) — no existing `Jurisdiction` row's `kind`, `country`, `stateOrRegion`, or any
  other field was touched.
- Chicago and Greater Manchester both continue to render identically on the Place Profile page (see
  Phase 13 browser verification) — neither has a parent or children, so both new fields are simply
  NULL, with zero effect on any existing query or page.
