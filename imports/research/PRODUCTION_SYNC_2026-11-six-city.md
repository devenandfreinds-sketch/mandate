# Production sync: six-city pull (school funding, Flock cameras, assessment fairness), November 2026

Run from `server/`, in this order, after the commit has deployed on Railway. Same rule as earlier syncs:
commands are written out in full; do not wrap them in shell helpers.

All 11 imports were dry-run and committed against a fresh local database on 2026-11-10 (migrate, seed,
import): 71 rows, 0 invalid. A reseed afterwards left all 71 untouched.

## 1. Seed (creates 5 metrics and 11 sources)

```bash
railway run --service server -- env SEED_CONFIRM=yes npm run db:seed
```

New metrics, all `realDataOnly` (no placeholder values are generated, so cities without data show
"No data available"):

| Metric | Category | Cities with data |
|---|---|---|
| `per_pupil_school_spending` | Education | Chicago, NYC, DC, Seattle (FY2015-FY2024) |
| `naep_score_gap_vs_national` | Education | Chicago, NYC, DC (2015, 2017, 2019, 2022, 2024) |
| `gcse_attainment8` | Education | Greater Manchester (AY2018-19 to AY2025-26) |
| `flock_cameras_per_100k` | Public Safety | Chicago, NYC, DC, Seattle (2026) |
| `residential_assessment_prd` | Government Capacity | Chicago 2024, NYC 2026, Seattle 2025, DC 2024 |

## 2. Imports (11 files)

```bash
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/us-per-pupil-school-spending-2015-2024.csv" --source "U.S. Census Bureau Annual Survey of School System Finances (per-pupil current spending)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/us-naep-score-gap-2015-2024.csv" --source "NCES NAEP Trial Urban District Assessment (Nation's Report Card)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/greater-manchester-attainment8-2018-2026.csv" --source "DfE Key Stage 4 Performance — Greater Manchester (Attainment 8)" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/washington-dc-flock-cameras-2026.csv" --source "Washington Sun (NOTUS), \"D.C. Won't Say How It's Using Its Flock Cameras\" (28 August 2026)" --quality alternative --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/chicago-flock-cameras-2026.csv" --source "FOX 32 Chicago, Chicago police Flock searches and audit logs (7 October 2026)" --quality alternative --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/new-york-city-flock-cameras-2026.csv" --source "West Side Rag, \"An Upper West Side Flock Camera Map Misunderstanding\" (13 August 2026)" --quality alternative --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/seattle-flock-cameras-2026.csv" --source "Seattle City Council, Public Safety Chair statement on SPD technology (24 February 2026)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/chicago-assessment-prd-2024.csv" --source "Cook County Assessor Open Data — Assessed Values and Parcel Sales" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/new-york-city-assessment-prd-2026.csv" --source "NYC Department of Finance — Property Valuation and Assessment Data and Citywide Annualized Sales" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/seattle-assessment-prd-2025.csv" --source "King County Assessor Data Extracts — Real Property Account, Sales and Parcel" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/washington-dc-assessment-prd-2024.csv" --source "DC Office of Tax and Revenue, FY2025 Assessment Ratio Report" --quality government --period-type year
```

Flock figures for DC, Chicago and NYC go in as `alternative` because they rest on named news reports, not
government publications (no government publishes Flock counts). Seattle's rests on a City Council
statement. The three PRD values for Chicago, NYC and Seattle are Mandate's own ratio studies from
government open data; they are tagged `government` because every input is a government record, and each
row's note says it is Mandate's calculation. If you would rather tag researcher calculations as
`estimated`, re-run those three with `--quality estimated`.

## 3. Verify

- `/places/chicago?category=education`: spending (10 periods) and NAEP gap (5 periods), all real.
- `/places/greater-manchester?category=education`: Attainment 8, 8 periods.
- `/metrics/residential_assessment_prd`: 4 jurisdictions; NYC 1.045 is above the IAAO 1.03 line.
- `/findings/school-spending-vs-test-scores-six-cities`, `/findings/flock-cameras-six-cities` and
  `/findings/over-assessed-homes-six-cities` are static content and go live with the client deploy alone.

## Not imported, and why

- **Dublin:** not a Mandate jurisdiction. Its figures are in the research brief and findings only.
- **Greater Manchester Flock / school funding / assessment fairness:** no Flock record either way; DfE
  schools-block funding is not comparable with US current spending; council tax bands have no current
  valuation to test. All three are covered in the findings instead.
- **Appeal outcomes** (Chicago, NYC, DC, GM): each city measures a different stage of a different
  process, so they stay in `six-city-property-assessment-summary-2026-11.csv` and the findings rather
  than one cross-city metric.
