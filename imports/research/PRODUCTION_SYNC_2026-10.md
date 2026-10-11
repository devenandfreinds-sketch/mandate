# Production sync: Durham and Greater Manchester research sweeps (October 2026)

Run from `server/`, in this order. Each command is written out in full on purpose: an earlier local run
used a shell helper that silently dropped `--currency GBP` (zsh does not word-split `${var:+...}`), and
three files landed as USD. Do not wrap these in helpers.

## 1. Seed (creates the 16 new Source rows and the new `unavailable` declarations)

```bash
railway run --service server -- env SEED_CONFIRM=yes npm run db:seed
```

## 2. Imports (27 files)

```bash
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/durham-crime-rates-2020-2026-ons.csv" --source "ONS Recorded Crime by Community Safety Partnership — County Durham" --quality government --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/durham-crime-rates-2015-2020-derived.csv" --source "Home Office Police Recorded Crime CSP Open Data — County Durham (derived rates)" --quality estimated --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/durham-clearance-rate-2015-2025.csv" --source "Home Office Police Recorded Crime and Outcomes Open Data — Durham Constabulary" --quality estimated --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/durham-emergency-response-2015-2026.csv" --source "Home Office Fire Statistics Table FIRE1001 (Average Response Times by Fire and Rescue Authority)" --quality estimated --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/durham-transit-ridership-2015-2025.csv" --source "DfT Bus Statistics BUS01e: Local Bus Passenger Journeys by Local Authority" --quality government --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/durham-transit-reliability-2015-2025.csv" --source "DfT Bus Statistics BUS09a: Non-Frequent Bus Services Running on Time by Local Authority" --quality government --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/durham-active-transportation-mode-share-census.csv" --source "Census 2011 QS701EW and Census 2021 TS061: Method of Travel to Work (Nomis)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/durham-average-commute-minutes-2015-2016.csv" --source "ONS Labour Force Survey: Travel to Work Time by Local Authority (ad hoc 008005)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/durham-public-transport-expansion-2015-2025.csv" --source "County Durham Rail and BRT Openings Review (Network Rail; North East Combined Authority)" --quality estimated --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/government-capacity/durham-capital-budget-execution-2015-2025.csv" --source "Durham County Council Cabinet: General Fund Final Outturn Reports (Capital)" --quality estimated --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/greater-manchester-active-mode-share-census.csv" --source "Census 2011 QS701EW and Census 2021 TS061: Method of Travel to Work (Nomis)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/greater-manchester-public-transport-expansion-2015-2025.csv" --source "Greater Manchester Rail, Metrolink and Busway Openings (DfT LRT0203, TfGM, Network Rail)" --quality estimated --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/greater-manchester-transit-ridership-bus01e-2015-2025.csv" --source "DfT Bus Statistics BUS01e: Local Bus Passenger Journeys by Local Authority" --quality government --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/greater-manchester-transit-reliability-bus09a-2015-2025.csv" --source "DfT Bus Statistics BUS09a: Non-Frequent Bus Services Running on Time by Local Authority" --quality government --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/transit/average-commute-minutes-2014-gm-durham.csv" --source "ONS Labour Force Survey: Travel to Work Time by Local Authority (ad hoc 008005)" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/public-safety/greater-manchester-emergency-response-fire1001-2015-2026.csv" --source "Home Office Fire Statistics Table FIRE1001 (Average Response Times by Fire and Rescue Authority)" --quality estimated --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/housing/greater-manchester-housing-starts-2015-2024.csv" --source "MHCLG Live Table 253 — House Building: Permanent Dwellings Completed by Local Authority" --quality government --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/housing/greater-manchester-housing-starts-2024-2026-provisional.csv" --source "MHCLG Live Table 253 — House Building: Permanent Dwellings Completed by Local Authority" --quality estimated --period-type uk_fiscal_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/housing/greater-manchester-median-rent-prms-2015-2023.csv" --source "ONS/VOA Private Rental Market Summary Statistics in England (Table 2.7)" --quality government --period-type uk_fiscal_year --currency GBP
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/innovation/greater-manchester-business-formation-2015-2024.csv" --source "ONS Business Demography Reference Tables (Table 1.1, Enterprise Births) — Greater Manchester" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/innovation/greater-manchester-university-spinouts-2014-2023.csv" --source "HESA HE-BCI Table 4e (Spin-off Activities) — Greater Manchester Providers" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/innovation/greater-manchester-commercial-rd-investment-2022-2024.csv" --source "ONS Business Enterprise R&D (BERD) by ITL2 Region" --quality government --period-type year --currency GBP
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/workforce/greater-manchester-labor-force-participation-aps-2015-2025.csv" --source "ONS Annual Population Survey (APS) — Greater Manchester Combined Authority" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/workforce/greater-manchester-apprenticeships-participation-2015-2025.csv" --source "DfE Apprenticeships — Starts, Participation, Achievements by Local Authority District" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/workforce/greater-manchester-skills-training-participation-2016-2025.csv" --source "DfE Further Education and Skills — Participation by Local Authority" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/workforce/durham-apprenticeships-2015-2019-gapfill.csv" --source "DfE Apprenticeships — Starts, Participation, Achievements by Local Authority District" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/workforce/durham-median-wages-2015-2023.csv" --source "ONS Annual Survey of Hours and Earnings (ASHE), Table 7.7a — County Durham" --quality government --period-type year --currency GBP
```

## 3. Retire the three replaced GM rows

```bash
railway run --service server -- sh -c 'psql "$DATABASE_URL" -f ../imports/research/gm-retire-rows-2026-10.sql'
```

Expect `DELETE 3` (transit_ridership 2024, transit_reliability 2025, median_rent 2026). It matches on old
values too, so a second run deletes nothing.

## 4. Reseed once more (clears calendar-year placeholders on newly real fiscal/academic-year pairs)

```bash
railway run --service server -- env SEED_CONFIRM=yes npm run db:seed
```

## 5. Verify

- Durham has no placeholder rows; GM's remaining placeholders are only the older partial gaps
  (advanced_manufacturing/life_sciences/tech_employment 2015-2017 and 2025, business_survival_rate,
  median_wages 2015-2023, pension_funding_ratio).
- Every real currency value for a UK jurisdiction is GBP:

```sql
SELECT j.slug, d.slug, mv."currencyCode", count(*) FROM "MetricValue" mv
JOIN "Jurisdiction" j ON j.id = mv."jurisdictionId" JOIN "MetricDefinition" d ON d.id = mv."metricDefinitionId"
WHERE d.unit = 'currency' AND mv."dataQuality" NOT IN ('placeholder','unavailable')
  AND j.country = 'United Kingdom' AND mv."currencyCode" <> 'GBP'
GROUP BY 1,2,3;   -- expect no rows
```

- Spot-check on the live API (`https://server-production-52a2.up.railway.app/api/v1/jurisdictions/<slug>/metrics?category=<cat>`):
  Durham violent_crime_rate FY2025-26 = 3508; GM transit_ridership FY2024-25 = 171036213; GM median_rent
  FY2022-23 = 775 GBP; Durham apprenticeships AY2015-16 = 13860.
