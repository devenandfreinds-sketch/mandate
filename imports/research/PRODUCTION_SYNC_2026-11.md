# Production sync: GM Education category + placeholder gap-fills (November 2026)

Run from `server/`, in this order, after the commit has deployed on Railway. Same rule as the October
sync: commands are written out in full; do not wrap them in shell helpers (that is how `--currency GBP`
got dropped last time).

All four imports were dry-run and committed against a local copy of the schema on 2026-11-07:
0 invalid rows, and a reseed afterwards left them untouched.

## 1. Seed (creates the Education category, the `persistent_absence_rate` metric, the DfE source and the Chicago research task)

```bash
railway run --service server -- env SEED_CONFIRM=yes npm run db:seed
```

`persistent_absence_rate` is `realDataOnly`: the seed generates no placeholder values for it, so every
jurisdiction except Greater Manchester shows "No data available" until real data is imported.

## 2. Imports (4 files)

```bash
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/education/greater-manchester-persistent-absence-2015-2025.csv" --source "DfE Pupil Absence in Schools in England — Greater Manchester (persistent absence)" --quality government --period-type uk_academic_year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/workforce/greater-manchester-median-wages-2015-2023.csv" --source "ONS Annual Survey of Hours and Earnings (ASHE), Table 7.7a — Greater Manchester" --quality government --period-type year --currency GBP
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/innovation/greater-manchester-tech-life-sciences-2015-2017.csv" --source "Nomis Business Register and Employment Survey (BRES) — Greater Manchester" --quality government --period-type year
railway run --service server -- npx tsx src/import/cli.ts --file "../imports/data/innovation/greater-manchester-advanced-manufacturing-2015-2017.csv" --source "Nomis Business Register and Employment Survey (BRES) — Greater Manchester" --quality estimated --period-type year
```

Advanced manufacturing goes in as `estimated` because SIC 26-30 is an analyst-built proxy (see the BRES
source's methodology note). If the existing 2018-2024 rows were imported as `government`, match that instead.

## 3. Verify

- `/places/greater-manchester?category=education`: one chart, 9 periods, all real (AY2015-16 to AY2024-25, no AY2019-20).
- `/places/greater-manchester?category=workforce`: median wages 2015-2025 should all be real, no placeholder badge.
- `/findings/greater-manchester-schools-who-runs-what` is static content and goes live with the client deploy alone.
