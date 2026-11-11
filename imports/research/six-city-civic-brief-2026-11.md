# Six-city brief: school funding vs test scores, Flock cameras, over-assessed property (November 2026 pull)

**Cities:** Greater Manchester, Chicago, Seattle, New York City, Washington DC, Dublin.
**Scope rule:** government sources first; reputable news only where no government record exists
(Flock contracts), and each such figure is labelled. Pulled 2026-11-10.
Every series that maps to a Mandate city is now in the app as a real-data-only metric (12 metrics; see
`PRODUCTION_SYNC_2026-11-six-city.md`). This brief keeps the cross-district results and Dublin figures as text. NAEP gaps are computed from unrounded means.

## 1. School funding vs standardized test scores

**Finding:** funding on its own barely predicts scores. Poverty/disadvantage predicts them strongly
in every system checked. Holding need constant, funding has a small positive, non-significant link.

| Comparison | n | Funding vs scores r (p) | Need vs scores r | Funding vs scores after need, partial r (p) |
|---|---|---|---|---|
| US big-city districts, NAEP 2024 | 26 | −0.15 (0.45) | −0.82 | +0.19 (0.36) |
| Washington districts 10k+, SBAC 2023-24 | 32 | −0.15 (0.41) | −0.94 | +0.07 (0.69) |
| All English local authorities, GCSE 2024/25 | 151 | +0.17 (0.04) | −0.31 | +0.64 (<0.001) |
| English LAs outside London | 119 | −0.56 (<0.001) | −0.63 | −0.03 (0.75) |
| Greater Manchester boroughs | 10 | −0.56 (0.09) | −0.61 | +0.11 (0.78) |

The all-England positive result is a London effect (London gets an area-cost uplift and scores well);
outside London funding follows disadvantage and the partial correlation is zero.

**City figures (NAEP 2024, Census FY2024):**

| District | Spending per pupil | Child poverty | Avg gap to national public (pts) | Gap vs model (spending + poverty) |
|---|---|---|---|---|
| New York City | $35,796 | 23.4% | −5.0 | +5.0 |
| DC Public Schools | $31,529 | 24.6% | −4.7 | +7.3 |
| Chicago | $24,330 | 20.9% | −8.5 | +0.6 |

Seattle (state test, not NAEP): $22,564 per pupil, 34.3% low income, 63.1% meeting standard
(ELA 67.6, math 58.7), 3.5 points above what its low-income share predicts.
Greater Manchester: Trafford gets the least funding (£5,922) and scores highest (A8 57.9, grammar
schools); Manchester gets the most (£6,777, 51.8% disadvantaged) and scores 44.8.
**Dublin:** Ireland publishes no area-level standardized test results, so no correlation is
possible. ERC NAMER 2021: DEIS Urban Band 1 pupils score ~30 points below urban non-DEIS pupils,
unchanged since 2014.

In the app: `imports/data/education/` (spending, NAEP gap, child poverty, Seattle state test, GM Attainment 8
and schools block funding). The cross-district files behind the correlations (26 NAEP districts, 32 Washington
districts, 151 English councils) cover places outside Mandate and were removed; they are in git at commit `7805add`.

Sources: Census Annual Survey of School System Finances FY2024 (elsec24, Table 18; Boston and
Cleveland computed as (TCURELSC−V91−V92)/V33, the formula that reproduces Table 18); NAEP Data
Service 2024 TUDA; Census SAIPE school districts 2024 (ussd24.txt); OSPI on data.wa.gov
(5i5h-c5pk, vnm3-j8pe, q4ba-s3jc); DfE Explore Education Statistics API (KS4 dataset
b3e19901-…); DfE NFF summary tables 2025-26 workbook, 2024-25 schools block baseline £/pupil.

## 2. Flock cameras per capita

| City | Population | Flock cameras (city/police) | Per 100k |
|---|---|---|---|
| Washington DC | 693,645 | 67 | 9.66 |
| Chicago | 2,731,585 | 0 (no contract; CPD buys access, 23,000+ searches May–Jul 2026) | 0 |
| New York City | 8,584,629 | 0 (NYPD, DOT, MTA confirmed) | 0 |
| Seattle | 784,777 | 0 (Council: Seattle does not use Flock; Axon ALPR suspended 20 Mar 2026) | 0 |
| Greater Manchester | 3,017,590 | 0 known (Home Office National ANPR Service instead) | 0 |
| Dublin (county) | 1,458,154 | 0 known (Garda vehicle ANPR) | 0 |

No government publishes a Flock count; DC's figure is the MPD contract (Washington Sun/NOTUS,
2026-08-28). Populations: Census Vintage 2025; ONS mid-2025 via Nomis; CSO Census 2022 (F1001).
In the app: `imports/data/public-safety/*-flock-cameras-2026.csv` (Chicago, NYC, DC, Seattle). Greater Manchester
and Dublin rows were removed: no record either way, and Dublin is not a Mandate jurisdiction.

## 3. Over-assessed property

| City | Measure | Result |
|---|---|---|
| Chicago | 2024 reassessment: parcels cut on appeal | 25.7% residential, 45.0% commercial, 53.2% multifamily; commercial AV cut 23.1% |
| Chicago | Ratio study (2024 initial values vs 2023 sales) | median 0.954, COD 14.3, PRD 1.009 (pass); cheapest tenth 1.09 vs ~0.93 middle |
| New York City | Class 1 ratio study (FY2027 market value vs 2025 sales) | median 1.017, COD 16.7, **PRD 1.045, PRB −0.054 (fail)**; cheapest tenth 1.30 vs 0.88 top |
| New York City | Taxable value as % of sale price | 5.19% cheapest tenth vs 2.19% top tenth |
| New York City | Tax Commission 2025 | 57,198 applications; 12.3% accepted reductions ($3.95bn AV); Class 1 only 3.3% |
| Washington DC | OTR FY2025 ratio study | residential PRD 1.00 (pass); **commercial PRD 1.05 (fail)** |
| Washington DC | RPTAC tax year 2024 | 14% of residential (359 of 2,557) and 8% of commercial appeals reduced (the report's text says 6% for residential, which contradicts its own counts) |
| Seattle | Single-family ratio study (2025 values vs 2024 sales) | median 0.924, COD 8.5, PRD 1.012 (pass); 0.96 cheapest vs 0.88 top |
| Greater Manchester | VOA council tax challenges 2025-26 | 3,540 received; 380 of 2,940 resolved (12.9%) cut a band; 2.9 per 10k dwellings vs England 3.9 |
| Dublin | Revenue LPT (national, 2021) | 13% of owners chose a higher band than guidance, 22% lower, 65% same |

Ratio studies here are Mandate's own calculations using IAAO conventions (1.5×IQR trim, PRD =
mean ratio / weighted mean ratio, PRB regression on log2 value proxy) except DC, which is OTR's
published study. Low-price tenths can be inflated by distressed or non-market sales that slip
through filters; the direction matches published findings (e.g. NYC's 2021 Advisory Commission).
Seattle has no appeal figures here (King County Board of Equalization not pulled).
In the app: `imports/data/government-capacity/` (PRD, median ratio, COD, DC commercial PRD, appeal reduction
rates for Chicago, NYC, DC and Greater Manchester). The price-tenth tables and Dublin rows can't be imported and
were removed; they are in git at commit `7805add`, and the key figures are in the import rows' notes.

Sources: Cook County Assessor open data (uzyt-m557, wvhk-k5uv, y282-6ig3) and Board of Review
(7pny-nedm); NYC DOF (8y4t-faws, w2pb-icbu); NYC Tax Commission 2025 Annual Report; DC OTR FY2025
Assessment Ratio Report; DC RPTAC Tax Year 2024 Annual Report; King County Assessor extracts
(EXTR_RPAcct, EXTR_RPSale, EXTR_Parcel, Nov 2026); VOA Council Tax challenges and changes March
2026; MHCLG Live Table 125; Revenue LPT Valuation 2026-2030 Technical Paper.
