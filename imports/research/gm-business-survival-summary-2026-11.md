# Greater Manchester: business survival and dwelling vacancy (November 2026 pull)

**Scope rule:** government sources only, all of them already in Mandate's registry
(`uk_ons`, `uk_mhclg` in `server/prisma/seed/data/sources.ts`). Nothing else is cited.

Nothing in the seed data was changed. These are research files for review before any import.

## 1. Business survival rates (ONS Business Demography)

- **Source:** ONS Explore Local Statistics, business survival indicators (1- to 5-year), CSV API
  `https://www.ons.gov.uk/explore-local-statistics/api/v1/data/business-survival-{one..five}-year.csv?time=all`,
  pulled 2026-11-07. Release date 20 November 2025.
- **Data:** `gm-business-survival-ons-2026-11.csv` (210 rows: 10 boroughs, Greater Manchester
  E11000001 as published by ONS, North West, England, UK).
- **Definition:** a business counts as surviving N years if it is active (employment and/or turnover)
  in the Nth calendar year after its birth year.
- **Check:** ONS's published Greater Manchester 5-year rate for 2019 births (35.37%) matches the value
  already in `imports/data/innovation/greater-manchester-business-survival-2019.csv`.

### Greater Manchester vs England, by birth cohort (%)

| Survival period | 2019 | 2020 | 2021 | 2022 | 2023 |
|---|---|---|---|---|---|
| 1-year, GM | 94.0 | 93.0 | 90.9 | 92.2 | 93.0 |
| 1-year, England | 94.7 | 92.9 | 93.5 | 92.4 | 93.4 |
| 2-year, GM | 74.4 | 71.1 | 64.9 | 67.3 | |
| 2-year, England | 74.7 | 71.3 | 70.3 | 68.9 | |
| 3-year, GM | 53.2 | 51.1 | 48.1 | | |
| 3-year, England | 55.9 | 52.8 | 53.5 | | |
| 4-year, GM | 41.9 | 40.7 | | | |
| 4-year, England | 44.9 | 43.8 | | | |
| 5-year, GM | 35.4 | | | | |
| 5-year, England | 38.3 | | | | |

### 5-year survival, 2019 births, by borough (%)

| Stockport | Rochdale | Tameside | Trafford | Wigan | Bury | Manchester | Oldham | Bolton | Salford |
|---|---|---|---|---|---|---|---|---|---|
| 42.1 | 41.0 | 40.1 | 39.2 | 38.8 | 33.9 | 33.9 | 33.2 | 32.4 | 28.2 |

North West 36.6, England 38.3, UK 38.4.

**Caveat (ONS):** a rise in multiple business registrations at single postcodes on the IDBR has
affected births, deaths and survival rates. Small boroughs' rates move a lot year to year.

## 2. Dwelling vacancy (MHCLG Live Tables 615 and 125)

**This is whole-stock vacancy, NOT rental vacancy.** Mandate's `vacancy_rate` metric (rental) stays
`unavailable` for Greater Manchester: no government source isolates private-rented vacancy.

- **Sources:** MHCLG Live Table 615 (all vacant and long-term vacant dwellings by LA, council tax base,
  first Monday in October) and Live Table 125 (dwelling stock estimates by LA, unrounded, 31 March).
  From `https://www.gov.uk/government/statistical-data-sets/live-tables-on-dwelling-stock-including-vacants`,
  pulled 2026-11-07.
- **Data:** `gm-whole-stock-vacancy-mhclg-2026-11.csv` (2015-2025; 10 boroughs, GM sum, North West,
  England).
- **Method:** rate = vacant dwellings (October, year Y) / dwelling stock (31 March, year Y). The GM
  figure is the sum of the 10 boroughs' vacants over the sum of their stock (Mandate's calculation;
  MHCLG publishes no GM total). The two dates are about six months apart.
- **Long-term vacant:** empty and substantially unfurnished for over six months (definition varies by
  council since April 2013).

| Year | GM vacant | GM long-term vacant | GM stock | GM vacancy % | GM long-term % | England vacancy % |
|---|---|---|---|---|---|---|
| 2015 | 32,637 | 11,873 | 1,188,480 | 2.75 | 1.00 | 2.55 |
| 2016 | 30,423 | 11,150 | 1,194,475 | 2.55 | 0.93 | 2.48 |
| 2017 | 30,302 | 10,827 | 1,202,176 | 2.52 | 0.90 | 2.53 |
| 2018 | 31,162 | 10,840 | 1,210,978 | 2.57 | 0.90 | 2.62 |
| 2019 | 32,235 | 11,081 | 1,222,314 | 2.64 | 0.91 | 2.65 |
| 2020 | 32,611 | 12,607 | 1,235,865 | 2.64 | 1.02 | 2.69 |
| 2021 | 32,800 | 12,590 | 1,247,823 | 2.63 | 1.01 | 2.62 |
| 2022 | 34,018 | 12,806 | 1,259,197 | 2.70 | 1.02 | 2.69 |
| 2023 | 35,031 | 13,287 | 1,268,533 | 2.76 | 1.05 | 2.75 |
| 2024 | 34,560 | 12,669 | 1,278,760 | 2.70 | 0.99 | 2.81 |
| 2025 | 34,967 | 12,824 | 1,289,123 | 2.71 | 0.99 | 2.92 |

Borough-level rates are in the CSV.

## Decisions for the methodology lead

1. Import the 1-5 year survival series? `business_survival_rate` is defined as 5-year, so only the
   5-year rows fit it as-is; the shorter windows would need their own metrics.
2. Add whole-stock vacancy as a separate metric (never labelled rental vacancy), as the October 2026
   GM sweep suggested?
