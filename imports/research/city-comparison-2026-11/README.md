# Six-city comparison: school meals, healthcare costs, climate (Nov 2026)

Research pull covering Seattle, Greater Manchester, Chicago, New York City,
Washington DC and Dublin over roughly 2015–2025. Every figure comes from a government
statistical release or a city's own published inventory; where a figure is
derived or approximate, that is stated.

Full written report with charts: [`REPORT.md`](REPORT.md). All charts on one page: [`charts/all-charts.png`](charts/all-charts.png).
Interactive version with charts: https://claude.ai/artifact/Y3x79ZtczM8gCdpygXHuBn

Data files in this folder (all compiled from the sources below):

| File | Contents |
|---|---|
| `school_meals.csv` | Share of pupils eligible for free/reduced-price meals (or nearest official measure), by place and school year |
| `gm_boroughs_fsm.csv` | Free-school-meal eligibility for the 10 Greater Manchester boroughs, 2015/16 vs 2025/26 |
| `health_costs.csv` | CPI medical and all-items indexes (2015=100), employer family premiums by state, UK health spending per person, NHS GM allocation |
| `climate.csv` | Annual temperatures, Mauna Loa CO2, EPA/DEFRA air quality, city GHG inventory totals |

## 1. Free and reduced-price meals

| Place | Measure | 2015–16 | Latest | Change |
|---|---|---|---|---|
| Greater Manchester (10 boroughs) | Free school meals eligible (DfE) | 18.2% | 33.4% (2025/26) | +15.2 pts |
| England (reference) | Free school meals eligible | 14.3% | 26.5% (2025/26) | +12.2 pts |
| Seattle Public Schools | Low-income / FRL eligible (OSPI) | 38.9% | 35.1% (2025–26) | −3.9 pts |
| Chicago Public Schools | FRL / economically disadvantaged (CPS) | 80.7% | 68.9% (2026–27); 71.8% (2025–26) | −11.8 pts |
| NYC DOE (district schools) | Poverty (FRL or HRA benefits) | 70.7% | 74.0% (2025–26) | +3.3 pts |
| DC public schools (DCPS + charters) | At-risk (OSSE) | 45.9% | 44.7% (2025–26) | −1.2 pts |
| Dublin (Ireland, national) | Pupils served by the School Meals Programme | 17.6% | 42.0% (2023–24) | +24.4 pts |

Notes:
- England has no "reduced-price" tier; free-school-meal eligibility is a stricter benefits-based test, so GM's level is not directly comparable with US FRL rates, but its trend is. Manchester borough alone rose from 27.5% to 49.0%.
- NYC broadened its poverty definition in 2017–18 (adds HRA benefit recipients), producing a step up that year.
- Chicago's 2020–21 low (63.8%) reflects pandemic disruption to eligibility paperwork.
- DC: every school serves universal free meals (Community Eligibility), so NCES reports a flat imputed 76.4% FRL rate for 2015–16 to 2019–20. OSSE's at-risk share is used instead; 2016–17 was not published in that form.

- Dublin: Ireland has no means-tested lunch eligibility and the Department of Social Protection publishes no Dublin count. The series is children served by the national School Meals Programme (158,406 in 2015/16 → 408,060 in 2023/24) over national primary + post-primary enrolment (CSO EDA42/EDA72). The rise is policy-driven: hot meals expanded to all DEIS and then 900 more primary schools; from 2025/26 about 682,000 children are in eligible schools (Dáil reply, 28 May 2025).

## 2. Healthcare costs

| Area | Medical-care CPI 2015→2025 | All-items CPI 2015→2025 |
|---|---|---|
| Seattle metro | +28.8% | +45.2% |
| Chicago metro | +23.6% | +32.2% |
| New York metro | +27.0% | +32.6% |
| US average | +29.8% | +35.8% |
| UK (applies to GM) | +39.1% (CPI health) | +38.4% |
| Ireland (applies to Dublin) | +17.9% (CSO CPI health) | +24.2% |

Washington DC: BLS discontinued the DC-area medical-care index after its 2018 geographic redesign.

Average employer family premium per enrolled employee (AHRQ MEPS-IC, private sector):

| State | 2015 | 2025 | Change | After US inflation | Worker contribution 2015 → 2025 |
|---|---|---|---|---|---|
| Washington (Seattle) | $16,627 | $27,618 | +66.1% | +22.3% | $4,265 → $8,222 (+93%) |
| Illinois (Chicago) | $17,227 | $28,248 | +64.0% | +20.7% | $3,890 → $7,838 (+101%) |
| New York | $19,630 | $29,752 | +51.6% | +11.6% | $5,190 → $7,075 (+36%) |
| District of Columbia | $19,104 | $29,371 | +53.7% | +13.2% | $5,120 → $8,028 (+57%) |
| US average | $17,322 | $26,281 | +51.7% | +11.7% | $4,710 → $7,314 (+55%) |

UK / Greater Manchester: UK healthcare spending per person rose from £2,931 (2015) to £4,966 (2025, provisional), +69% nominal; out-of-pocket spending rose from £473 to £698 (+48%). Ireland: healthcare spending per person rose from €4,097 (2015) to €6,728 (2024), +64.2%; out-of-pocket from €557 to €713 (+28.0%) (Eurostat health accounts). NHS Greater Manchester receives £2,065 per registered patient for core services in 2025/26 vs an England average of £1,975.

## 3. Climate: atmospheric measurement and emissions accounting

Temperature (annual means):

| Place | 1991–2020 normal | 2015–2025 average | Difference | Trend |
|---|---|---|---|---|
| Seattle (Sea-Tac) | 11.42 °C | 11.86 °C | +0.44 °C | +0.24 °C/decade since 1950 |
| NW England (Met Office, for GM) | 9.21 °C | 9.67 °C | +0.46 °C | +0.21 °C/decade since 1950 |
| Chicago (O'Hare) | 10.77 °C | 11.42 °C | +0.65 °C | +0.18 °C/decade since 1959 |
| New York (Central Park) | 13.20 °C | 13.72 °C | +0.52 °C | +0.24 °C/decade since 1950 |
| Washington (Reagan National) | 15.36 °C | 15.75 °C | +0.40 °C | +0.19 °C/decade since 1950 |
| Dublin (Phoenix Park, via NOAA) | 10.13 °C | 10.68 °C | +0.54 °C | see report page (gaps 2006–08, 2010–12) |

- CO2 at Mauna Loa: 401.0 ppm (2015) → 427.4 ppm (2025).
- Days with good air quality (EPA, metro), 2015–17 average → 2023–25 average: Seattle 161 → 200; Chicago 67 → 93; New York 79 → 142; Washington 91 → 191. Wildfire smoke drives the worst days (Chicago: 43 days above AQI 100 in 2023).
- Manchester Piccadilly (DEFRA): NO2 39.4 → 23.6 µg/m³ (2015 → 2025); PM2.5 10.5 → 9.6 µg/m³.

Greenhouse-gas inventories (million t CO2e):

| Place | Basis | Base | Latest | Change |
|---|---|---|---|---|
| Greater Manchester | DESNZ territorial, all sectors | 15.43 (2015) | 11.20 (2024) | −27.4% |
| Washington DC | DOEE citywide | 7.96 (2015) | 6.09 (2023) | −23.5% |
| New York | Citywide GPC inventory | 54.94 (2015) | 47.94 (2024) | −12.7% |
| Chicago | City inventory (approx. tonnes) | 32.2 (2015) | 30.1 (2017) | −6.6% |
| Seattle | Core sectors, before offsets | 3.14 (2014) | 2.98 (2022) | −5.1% |
| Ireland (national, for Dublin) | Eurostat / EPA, excl. LULUCF | 60.36 (2015) | 53.93 (2024) | −10.7% |

- Chicago's newest public citywide inventory is 2017; tonnes are approximate (published −11.0% and −16.9% vs a 36.2 Mt 2005 baseline).
- Seattle's figures are summed from Appendix A of its 2022 inventory (core subsectors); the official net core total after offsets is 2.88 Mt (2022).
- Dublin has no annual city inventory. Codema's 2016 baseline: 7.80 Mt for the four Dublin council areas, 2.81 Mt for Dublin City (5.1 t per resident).
- Dublin air quality: EPA Ireland publishes Dublin NO2/PM2.5 trends only as charts (traffic NO2 falling; St John's Road West breached the EU annual limit in 2019; solid-fuel PM2.5 keeps Dublin above WHO guidelines).
- Per resident: GM 5.60 → 3.72 t (2015 → 2024); Seattle 5.44 → 3.85 t (2008 → 2022, net core).

## Sources

- Dublin: Dept of Social Protection, Analytical Paper on the School Meals Programme; Dáil written answer 28 May 2025; CSO tables EDA42, EDA72, CPA01; Eurostat hlth_sha11_hf and env_air_gge; NOAA NCEI Global Summary of the Month EI000003969 (Dublin Phoenix Park); Codema Baseline Emission Inventories 2016; EPA Ireland, Air Quality in Ireland 2025

- DfE, Schools, pupils and their characteristics (explore-education-statistics, API dataset 019e7404-df19-71ce-90a8-f2e3db7dd7fa)
- OSPI Report Card Enrollment, data.wa.gov (one dataset per school year, 2014-15 to 2025-26)
- NYC DOE Demographic Snapshot: NYC Open Data bvzk-auuz, 3ydk-du45, smka-gz6w; InfoHub demographic-snapshot-2021-22-to-2025-26-public.xlsx
- Chicago Public Schools, District Data: Demographics (20th-day EL/IEP/low-income reports)
- OSSE annual enrollment audit reports and data, 2015-16 and 2017-18 to 2025-26
- BLS CPI-U via FRED: CUURA423SAM, CUURA207SAM, CUURA101SAM, CPIMEDNS, CUURA423SA0, CUURA207SA0, CUURA101SA0, CPIAUCNS
- AHRQ MEPS-IC Tables II.D.1 / II.D.2 (2015-2020); 2021, 2023-2025 MEPS-IC values as tabulated by KFF State Health Facts
- ONS CPI series D7BZ, D7BT; ONS UK Health Accounts reference tables (Table 1c), April 2026
- House of Commons Library CBP-10031, NHS integrated care board funding in England
- NOAA NCEI Climate at a Glance (USW00024233, USW00094846, USW00094728, USW00013743); Met Office HadUK-Grid England NW and N Wales
- NOAA GML Mauna Loa annual mean CO2; EPA AirData annual AQI by CBSA; DEFRA AURN site MAN3
- DESNZ UK local authority and regional GHG statistics 2005-2024; NYC Greenhouse Gas Emissions Inventory (wq7q-htne); DC DOEE 2006-2023 GHG inventory workbook; Seattle OSE 2022 Community GHG Emissions Inventory; City of Chicago 2017 GHG Inventory Report and 2008 Chicago Climate Action Plan
