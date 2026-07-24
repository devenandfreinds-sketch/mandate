# Currency and Units Architecture

**Problem this solves.** Before this pass, `MetricDefinition.unit` had a value literally named `"usd"`,
used by seven metrics (`median_rent`, `median_wages`, `budget_balance`, `debt_per_capita`,
`capital_investment`, `vc_investment`, `commercial_rd_investment`). Since `MetricDefinition` is a single
global row shared by every jurisdiction, this made it structurally impossible to import a real GBP,
EUR, JPY, or any non-USD figure under one of these metrics without either mislabeling it as dollars or
inventing an exchange-rate conversion with no defensible methodology. This was found and documented as
a P1 architectural limitation during the Greater Manchester pass (`docs/GREATER_MANCHESTER_CASE_STUDY.md`)
and is fixed here.

## What changed

1. **`MetricDefinition.unit`**: the value `"usd"` was renamed to `"currency"` (a generic "this metric is
   a monetary amount" marker), updated across all 7 affected metric seed files. This is a metadata
   relabeling only — no `MetricValue` rows were altered by this rename.
2. **`MetricValue.currencyCode`** (new column, `String @default("USD")`): records the ISO 4217 code the
   *specific value* is actually denominated in. Every pre-existing row got `"USD"` by the migration
   default — correct, since every pre-existing row genuinely was USD.
3. **Import pipeline**: `RunImportOptions.currencyCode` (optional, defaults to `"USD"`) and a new
   `--currency <code>` CLI flag apply one currency to an entire import batch — matching the existing
   pattern for `--quality`/`--period-type`, since one CSV realistically represents one jurisdiction/
   source pull in one currency.
4. **Display**: `formatMetricValue()` now switches on `unit === "currency"` and formats using the
   value's own `currencyCode` via `Intl.NumberFormat`, instead of hardcoding `"USD"`. Two call sites
   with a specific `MetricValue` in hand (the Place Profile raw-stats table, `MetricCard`) now pass
   `v.currencyCode` through. Chart axis-tick formatters, which format an arbitrary scale number rather
   than one data point, default to `"USD"` — a known, documented limitation (see below), not a silent
   bug, since no chart today displays a non-USD series.

## What Mandate does NOT do

- **Never auto-converts currencies.** A GBP value stays GBP, tagged `currencyCode: "GBP"`, forever. If
  a researcher wants a USD-equivalent comparison, that is an explicit, documented research decision
  (its own MetricValue row, or a note explaining the conversion and its date/rate), never something the
  platform silently computes.
- **Never conflates "estimated exchange rate" with "estimated data quality."** `dataQuality: "estimated"`
  already means "a researcher's own synthesis, not a number read directly off one source" — a currency
  conversion, if one is ever added, would be exactly this kind of estimation, and should be scored
  `estimated` and documented in `notes` for that reason, not invented as a new field.

## Fields considered but NOT implemented this pass

The task brief suggested a fuller model: `priceBasis`, `nominalOrReal`, `baseYear`, `conversionMethod`.
These were deliberately **not added as schema columns**, for one concrete reason: no current jurisdiction
has any nominal-vs-real or inflation-adjustment need. Chicago and Greater Manchester's currency-bearing
metrics (once genuinely researched) are single-point-in-time nominal figures; nothing today requires
distinguishing "nominal 2019 dollars" from "2019 dollars adjusted to 2025 purchasing power." Adding four
unused nullable columns now would be pure speculation — exactly the "over-engineer" the brief warned
against. The concepts are documented here so a future researcher who *does* need inflation adjustment
knows where they'd go:

- **`priceBasis`** (`nominal` | `real`): whether a value has been inflation-adjusted.
- **`nominalOrReal`**: same distinction, or fold into `priceBasis` directly — a genuine future design
  choice, not resolved here since nothing forces the choice yet.
- **`baseYear`**: which year's prices a "real"/inflation-adjusted value is expressed in.
- **`conversionMethod`**: free text describing how a converted-currency or inflation-adjusted value was
  derived (which exchange rate, which price index, from where) — this is the field that would carry
  the same "preserve provenance, never hide the estimation" discipline `notes`/`limitations` already
  carry elsewhere in the schema.

When a real research task needs one of these (e.g. comparing Chicago's and Greater Manchester's median
wages in constant-purchasing-power terms), add the specific field(s) that task needs, additively, with
a real worked example driving the design — not all four speculatively today.

## Verification

- `formatMetricValue("USD")` and existing Chicago currency-metric displays are pixel-identical to
  before this change (same `Intl.NumberFormat` call, same default).
- No existing `MetricValue` row's `value` or `dataQuality` was touched by this migration — only the
  new `currencyCode` column was added, defaulted to `"USD"` for every row.
- Reseed is idempotent: rerunning the seed script after this change produces identical row counts (see
  Phase 13 testing results in the final report).
