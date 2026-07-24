# Data Quality Model

## The problem this fixes

`MetricValue.dataQuality` (and `PipelineAssessment.dataQuality`) is a per-ROW label — it says nothing
about how much of a metric's full time series is actually researched. Before this pass, the only
series-level signal anywhere in the client was `dominantDataQuality()`
(`client/src/components/governance/DataQualityBadge.tsx`), a "worst value anywhere in the series wins"
reducer: a single leftover placeholder year among ten real years produced the exact same "Placeholder
Data" badge as a series with zero real years. That collapsed "we've done real research here" and
"nobody has looked" into one label — the opposite of conservatism, since it hides real progress rather
than being cautious about it.

## Audit findings (before changing anything)

Every place data quality is computed, aggregated, or displayed was inventoried first:

- **Row-level vocabulary** (`shared/src/types/pipeline.ts::DATA_QUALITY_LEVELS`): six levels —
  government/academic/alternative (tierRank 3, "real"), estimated (tierRank 2), unavailable (tierRank 1),
  placeholder (tierRank 0) — plus a legacy `"official"` value on old rows only. This vocabulary was left
  completely untouched by this pass, per the explicit constraint.
- **`dominantDataQuality`** was used in four places, not one: `CategorySection.tsx` (Place Profile
  historical charts — the specific bug reported), `MetricCard.tsx` (unused/dead code, fixed anyway for
  consistency), `DashboardPage.tsx` (cross-jurisdiction comparison chart), and `DataCatalogPage.tsx`
  (fed only the distinct *keys* of a breakdown map, an even cruder version of the same bug).
- **`researchProgress.service.ts`** (powers the Research Map) was, separately, already NOT exhibiting
  this bug — its aggregate `measured`/`unavailable`/`unresearched` percentages are a flat count-based
  split across every row, not a worst-wins reducer. It does have a milder, related issue: a 4-value
  `metricStatus()` helper (`measured`/`partial`/`unavailable`/`unresearched`) that treats "1 real year
  of 11" and "10 real years of 11" as the identically-labeled `"partial"`.
- **Two duplicate type declarations**: `MetricDetailItem`/`CoverageBreakdown` are hand-copied between
  `shared/src/types/researchMap.ts` and `server/src/services/researchProgress.service.ts` rather than
  imported from one place — a pre-existing inconsistency, noted but not fixed this pass (see Deferred
  Architecture).
- **`DataCatalogEntry`** (`shared/src/types/catalog.ts`) is a third, independent "how much real data do
  we have" shape (per-metric-definition, summed across every jurisdiction) with its own
  `completionPercent`/`isFullyPlaceholder`/`firstRealYear`/`lastRealYear` fields — genuinely different
  in grain from a single jurisdiction+metric series, and doesn't carry per-row temporal data, only
  aggregate counts.

## The model

`shared/src/types/seriesQuality.ts` exports `classifySeriesQuality(rows)`, which NEVER touches row-level
truth — it only reads `{dataQuality, periodStart}` pairs and derives one of six series-level categories:

| Category | Meaning |
|---|---|
| Fully Measured | Nearly every period has real evidence, no meaningful untouched gap. |
| Mostly Measured | Most periods are real; a few estimated/unavailable/placeholder periods remain. |
| Partially Measured | A meaningful share is real, but substantial gaps remain. |
| Limited Evidence | Some real evidence exists, but it's too sparse, scattered, or short a run to support a broad historical conclusion. |
| Fully Placeholder | No meaningful real evidence anywhere — not yet researched. |
| Unavailable | Substantively investigated and found to have no measurable evidence for essentially the whole series — a conclusion, not silence. |

### How the thresholds were chosen

Rather than picking fractions arbitrarily, the actual distribution of every (jurisdiction, metric) pair
with at least one non-placeholder row was queried directly (135 such series existed at the time of this
pass). The resulting fraction thresholds (evidence-fraction ≥0.9/0.7/0.35) were chosen to match the
brief's own worked examples (1/11 real → Limited Evidence; 5/11 → Partially Measured; 10/11 → Mostly
Measured; 11/11 → Fully Measured) and were checked against the real distribution: 17 series landed
"fully" (≥0.9), 4 "mostly" (0.7-0.9), 9 "partial" (0.35-0.7), and 103 "limited" (0-0.35) — a shape that
matches expectation, since most series from this session's research passes only gained 1-5 real years
each, while Chicago's mature metrics (from earlier passes) supplied nearly all of the "fully/mostly"
cases.

The calibration query also surfaced a real edge case: several Greater Manchester metrics (e.g.
`emergency_response_minutes`, `capital_budget_execution_rate`) had only **one** observed period total,
because their `uk_fiscal_year` real rows were the only rows generated for that pair at all (the existing
`realDataPairs` skip-logic never created a "year"-typed synthetic placeholder series alongside them). A
1/1 series is trivially "100% real" by fraction alone, but one single fiscal year cannot support "a
broad historical conclusion" — exactly the definition the brief gives for `limited_evidence`. This led
to `MIN_PERIODS_FOR_BROAD_CLAIM = 4`: below four total observed periods, no series can claim more than
Limited Evidence regardless of fraction.

### Two modifiers, not more categories

- **Recency**: Fully/Mostly Measured are downgraded one level if the chronologically LAST period has no
  evidence — a series can't be called "nearly complete" if its current state is unknown. This cascades:
  a 10/11-real series where the one gap happens to be the most recent year downgrades from
  Mostly→Partially, not just Fully→Mostly, since the underlying concern (currency) is the same either
  way.
- **Fragmentation**: three or more small, isolated evidence clusters (e.g. three single scattered real
  years across an 11-year span) are capped at Limited Evidence regardless of the raw fraction, per the
  brief's explicit example distinguishing "2015-2019 real, rest placeholder" (one contiguous run) from
  "2015, 2019, 2023 real, rest placeholder" (three isolated points) — the same count, deliberately
  different confidence.

### What the model deliberately does not attempt

Detecting substantive methodology inconsistency WITHIN "real" data (e.g. two real years measured by
genuinely different methods) requires reading the researcher's own notes/limitations text — it isn't
inferable from a dataQuality string, and building that detection is out of scope for a conservative
pass. Flag such cases in `MetricValue.notes` instead; the classifier can't see them.

### The counts-only fallback

`classifySeriesQualityFromBreakdown(rawCounts)` reuses the exact same fraction thresholds for call sites
that only have an aggregate `Record<dataQuality, count>` (no per-row dates) — `DataCatalogPage.tsx`'s
cross-jurisdiction summary. It cannot apply the recency or fragmentation modifiers, since those need to
know WHICH periods are evidenced, not just how many; this is a known, documented limitation of using the
coarser input, not an inconsistency in the model.

## UI changes

- `client/src/components/governance/SeriesQualityBadge.tsx` (new): a badge showing the category label,
  plus `SeriesQualityBreakdownText` — a one-line breakdown ("11 periods — 4 real, 1 estimated, 6
  placeholder · most recent period not yet researched").
- `CategorySection.tsx`, `MetricCard.tsx` (dead code, fixed for consistency), `DashboardPage.tsx`,
  `DataCatalogPage.tsx`, `ResearchJurisdictionDetailPage.tsx` (`MetricRow`) all now use the new
  classifier instead of `dominantDataQuality`, which was deleted (fully unused after the migration).
- `PlaceProfilePage.tsx`'s "Raw Statistics" table gained a per-row `DataQualityBadge` column — the
  per-row `dataQuality` value already existed on every row but was never surfaced anywhere in that
  table before this pass.

## Research Map

`researchProgress.service.ts`'s aggregate `dataCoverage`/`pipelineCoverage` percentages were audited and
found to already be a flat, honest count-based split (never the worst-wins bug) — **left completely
unchanged**, per the explicit instruction not to inflate headline numbers. The one genuine upgrade: the
jurisdiction-detail drill-down's per-metric row (`MetricDetailItem`) previously showed a crude 4-value
`measured`/`partial`/`unavailable`/`unresearched` status computed by a bespoke `metricStatus()` helper;
it now carries the full `SeriesQualityResult` (computed from the same underlying rows, now including
`periodStart`) and displays the same six-category badge used everywhere else, while the aggregate
percentage math sums `real+estimated` / `unavailable` / `placeholder` from that same object — an
identical computation to the old measured/unavailable/unresearched buckets, just re-expressed through
the new breakdown fields instead of duplicated counting logic.

## Deferred architecture (noted, not fixed this pass)

- `CoverageBreakdown`/`MetricDetailItem`/`PolicyAreaDetailItem`/`JurisdictionResearchDetail` are
  hand-duplicated between `shared/src/types/researchMap.ts` and
  `server/src/services/researchProgress.service.ts` rather than one importing from the other. Both were
  updated in lockstep for this pass's change, but this duplication predates this pass and is a real
  future footgun (the two can drift). Not fixed here because it's a refactor orthogonal to data quality,
  with its own risk of breaking something unrelated.
- `DataCatalogEntry` (`shared/src/types/catalog.ts`) is a third, independent "how much real data"
  shape, unrelated in structure to `CoverageBreakdown`. Worth unifying in a future pass if a fourth
  consumer of "coverage" ever appears, but two working, differently-shaped models for two genuinely
  different grains (one jurisdiction's series vs. one metric across every jurisdiction) isn't itself a
  problem worth a schema migration to solve now.
- The percent-metric validator (`server/src/import/validators.ts`) rejects any value outside 0-100 —
  correctly for something like a completion rate, but this doesn't fit every real percent-typed metric
  (NYC's capital-commitment achievement rate is genuinely 114% some years). Not changed this pass since
  it's an import-validation concern unrelated to data-quality classification, but flagged since it
  blocked one real value from a prior pass.
