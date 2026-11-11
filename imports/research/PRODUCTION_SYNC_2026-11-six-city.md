# Production sync: six-city pull (schools, Flock cameras, property assessment), November 2026

Run from `server/`, in this order, after PR #4 has merged and deployed on Railway. Same rule as earlier
syncs: commands are written out in full; do not wrap them in shell helpers (that is how `--currency GBP`
got dropped once before).

All 23 imports were dry-run and committed against a fresh local database (migrate, seed, import):
132 rows, 0 invalid, and a reseed afterwards left every one untouched.

## 1. Seed (creates 12 metrics and 18 sources)

```bash
railway run --service server -- env SEED_CONFIRM=yes npm run db:seed
```

All new metrics are `realDataOnly`: no placeholder values are generated, so places without data show
"No data available".

| Metric | Category | Data |
|---|---|---|
| `per_pupil_school_spending` | Education | Chicago, NYC, DC, Seattle, FY2015-FY2024 |
| `naep_score_gap_vs_national` | Education | Chicago, NYC, DC, 2015-2024 (5 test years) |
| `school_age_child_poverty_rate` | Education | Chicago, NYC, DC, Seattle, 2015-2024 |
| `state_test_met_standard_pct` | Education | Seattle, 2018-2025 (6 test years) |
| `gcse_attainment8` | Education | Greater Manchester, AY2018-19 to AY2025-26 |
| `schools_block_funding_per_pupil` | Education | Greater Manchester, FY2024-25 and FY2025-26 (GBP) |
| `flock_cameras_per_100k` | Public Safety | Chicago, NYC, DC, Seattle, 2026 |
| `residential_assessment_prd` | Government Capacity | Chicago 2024, NYC 2026, Seattle 2025, DC 2024 |
| `residential_assessment_median_ratio` | Government Capacity | same four |
| `residential_assessment_cod` | Government Capacity | same four |
| `commercial_assessment_prd` | Government Capacity | DC 2024 |
| `property_appeal_reduction_rate` | Government Capacity | Chicago 2024, NYC 2025, DC 2024, Greater Manchester 2025-26 |

## 2. Imports (23 files)

```bash
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/us-per-pupil-school-spending-2015-2024.csv" --source "U.S. Census Bureau Annual Survey of School System Finances (per-pupil current spending)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/us-naep-score-gap-2015-2024.csv" --source "NCES NAEP Trial Urban District Assessment (Nation's Report Card)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/us-school-age-child-poverty-2015-2024.csv" --source "U.S. Census Bureau Small Area Income and Poverty Estimates (SAIPE) — School Districts" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/seattle-state-test-met-standard-2018-2025.csv" --source "Washington OSPI Report Card Assessment Data — Seattle School District (Smarter Balanced)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/greater-manchester-attainment8-2018-2026.csv" --source "DfE Key Stage 4 Performance — Greater Manchester (Attainment 8)" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/greater-manchester-schools-block-funding-2024-2026.csv" --source "DfE National Funding Formula Tables 2025-26 — Greater Manchester schools block per pupil" --quality government --period-type uk_fiscal_year --currency GBP
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/washington-dc-flock-cameras-2026.csv" --source "Washington Sun (NOTUS), \"D.C. Won't Say How It's Using Its Flock Cameras\" (28 August 2026)" --quality alternative --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/chicago-flock-cameras-2026.csv" --source "FOX 32 Chicago, Chicago police Flock searches and audit logs (7 October 2026)" --quality alternative --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/new-york-city-flock-cameras-2026.csv" --source "West Side Rag, \"An Upper West Side Flock Camera Map Misunderstanding\" (13 August 2026)" --quality alternative --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/seattle-flock-cameras-2026.csv" --source "Seattle City Council, Public Safety Chair statement on SPD technology (24 February 2026)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/chicago-assessment-prd-2024.csv" --source "Cook County Assessor Open Data — Assessed Values and Parcel Sales" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/chicago-assessment-median-ratio-cod-2024.csv" --source "Cook County Assessor Open Data — Assessed Values and Parcel Sales" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/new-york-city-assessment-prd-2026.csv" --source "NYC Department of Finance — Property Valuation and Assessment Data and Citywide Annualized Sales" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/new-york-city-assessment-median-ratio-cod-2026.csv" --source "NYC Department of Finance — Property Valuation and Assessment Data and Citywide Annualized Sales" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/seattle-assessment-prd-2025.csv" --source "King County Assessor Data Extracts — Real Property Account, Sales and Parcel" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/seattle-assessment-median-ratio-cod-2025.csv" --source "King County Assessor Data Extracts — Real Property Account, Sales and Parcel" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/washington-dc-assessment-prd-2024.csv" --source "DC Office of Tax and Revenue, FY2025 Assessment Ratio Report" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/washington-dc-assessment-median-ratio-cod-2024.csv" --source "DC Office of Tax and Revenue, FY2025 Assessment Ratio Report" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/washington-dc-commercial-assessment-prd-2024.csv" --source "DC Office of Tax and Revenue, FY2025 Assessment Ratio Report" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/chicago-appeal-reduction-rate-2024.csv" --source "Cook County Assessor Open Data — Appeals" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/new-york-city-appeal-reduction-rate-2025.csv" --source "NYC Tax Commission 2025 Annual Report" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/washington-dc-appeal-reduction-rate-2024.csv" --source "DC Real Property Tax Appeals Commission, Tax Year 2024 Annual Report" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/greater-manchester-appeal-reduction-rate-2025-26.csv" --source "VOA Council Tax: Challenges and Changes, March 2026 — Greater Manchester" --quality government --period-type uk_fiscal_year
```

Each import is one `ImportJob` with a Rollback button at `/admin/imports`.

Quality tags: the Flock figures for DC, Chicago and NYC rest on named news reports (no government
publishes Flock counts), so they go in as `alternative`. The ratio-study metrics for Chicago, NYC and
Seattle are Mandate's own calculations from government open data; they are tagged `government`, and each
row's note says they are Mandate's calculation. To tag researcher calculations `estimated` instead,
change `--quality` on those six lines. Greater Manchester's 2025-26 funding row is provisional and carries
row-level confidence `estimated`.

## 3. Verify

- `/places/chicago?category=education`: spending (10 periods), NAEP gap (5), child poverty (10).
- `/places/seattle?category=education`: spending, child poverty, state test (6 periods).
- `/places/greater-manchester?category=education`: Attainment 8 (8) and schools block funding (2, in GBP).
- `/metrics/residential_assessment_prd`: 4 places; NYC 1.045 is above the IAAO 1.03 line.
- `/metrics/property_appeal_reduction_rate`: 4 places.
- The three six-city Findings are static content and go live with the client deploy alone.

## What is not in the database, and why

- **Dublin:** not a Mandate jurisdiction. Its figures stay as text in the Findings and the research brief.
- **Places outside Mandate:** the cross-district comparisons behind the correlations (26 NAEP districts,
  32 Washington districts, 151 English councils) and the price-tenth ratio tables. Their results are
  text in the Findings and brief; the raw files are in git at commit `7805add`.
- **Greater Manchester Flock cameras:** no public record either way, so no value to import.
- **City populations:** the 2025 estimates used for Flock rates are in those rows' notes. The
  jurisdictions' own population fields were not changed, because that would shift every placeholder chart.
