# The 2025 budget law in numbers: cost, who gains, the safety net and immigration enforcement (November 2026)

**Scope:** United States, national. Public Law 119-21, the "One Big Beautiful Bill Act", signed July 4, 2025.
**Pulled:** 2026-11-15. **Status:** research files for review. Nothing in the seed data or import CSVs was changed.

**Scope rule:** government sources only, the same rule as [`tax-jobs-obbba-brief-2026-11`](../tax-jobs-obbba-brief-2026-11/README.md), which this brief extends.

- **Used:** CBO, the Joint Committee on Taxation (JCT), the Congressional Research Service (CRS), GAO, the Treasury, the IRS, USDA, DHS, ICE and the Office of Government Ethics.
- **CBO and JCT were readable this time.** The earlier brief had to quote them through CRS and news reports. The figures here come from cbo.gov and jct.gov directly.
- **Dropped:** an earlier draft of this brief used think tanks, news reports and a Wikipedia list. All of that is gone, including the figures that only those sources carried.
- **Administration sources:** the Treasury and DHS releases are written by the administration that passed the law and present its case. They are used for their counts, labelled as such.

## What is new here, not in the earlier brief

| New | Source |
|---|---|
| The full ten-decile CBO table (the earlier brief had only bottom, middle and top) | CBO distribution tool |
| Interest cost of $718 billion, $4.1 trillion total, debt 9.5 points of GDP higher | CBO publication 61466 |
| Who gets the tax cut by income group, including the top 1% and top 0.1% | JCT JCX-33-25 |
| Monthly SNAP participation through July 2026 | USDA |
| Who claimed each new tax break in the 2026 filing season | Treasury |
| Homeland security funding by agency | CRS R48704 |
| Detention population, facilities and the Camp East Montana audit | GAO-26-108886 |
| Fiscal 2026 arrests and deportations | DHS |
| Deaths in ICE custody by fiscal year | ICE |

## What government sources could not answer

- **A per-household tax cut for the top 1%.** JCT publishes totals by income group, not averages.
- **The president's personal savings.** No government body has estimated them. His tax returns are not public, and his OGE disclosure reports assets and income in ranges.
- **Shootings by immigration agents.** No official national count was found.
- **The share of detainees without a criminal conviction.** ICE publishes this in spreadsheets that could not be downloaded in this pull.

## Three things to check before publishing

1. **JCT table.** JCX-33-25 scores the Senate substitute to H.R. 1, the version the Senate passed, not the enacted law as such. It also leaves out some provisions (its footnote 1).
2. **ICE death counts.** These are a machine count of entries on ICE's death-reporting page. Fiscal 2020–2024 match figures reported elsewhere; fiscal 2025 (24) and 2026 (36, to August 23) should be recounted by hand.
3. **Deportation counts.** DHS totals include voluntary departures and are not broken out for fiscal 2022–2024.

---

## The answers at a glance

| Question | Short answer |
|---|---|
| **What does the law cost?** | Revenues fall **$4.5 trillion** and direct spending falls **$1.1 trillion** over 2025–2034, adding **$3.4 trillion** to deficits. Interest adds **$718 billion**, for **$4.1 trillion** in all (CBO). |
| **Who gains and who loses?** | Taxes and benefits combined, 2026–2034 average: the lowest tenth of households loses **$1,214 a year (−3.1%)**; the highest tenth gains **$13,622 (+2.7%)** and receives **63.9%** of the total net gain (CBO). |
| **What do the top 1% get?** | **$131.5 billion** of the $545.3 billion tax cut in 2027, or **24.1%**. The bottom 60% of taxpayers get **12.8%** (JCT). |
| **How has the president benefited?** | Not known from government records. See above. |
| **What has happened to health and food aid?** | SNAP recipients fell from **41.6 million** in July 2025 to **36.1 million** in July 2026 (USDA). Medicaid loses **$989.7 billion** over ten years and **10 million** more people are uninsured in 2034 (CBO, via CRS). |
| **What did it do for immigration enforcement?** | **$74.85 billion** for ICE through fiscal 2029, on a regular budget of $10.0 billion a year (CRS). Detained population up 71% to 67,204 (GAO). 483,200 deportations in fiscal 2026 (DHS). |

---

## 1. The cost

| Item, fiscal 2025–2034 | $ billions |
|---|---|
| Revenue lost to tax cuts | 4,500 |
| Direct spending cuts | −1,100 |
| **Net added to deficits** | **3,400** |
| Interest on the added debt | 718 |
| **Total with interest** | **4,100** |

*Source: CBO publications 61570 and 61466 (`data/cbo_budget_totals.csv`). If the ten temporary tax provisions were made permanent, the total would be $5.0 trillion.*

## 2. Who gains, who loses

| Decile | Lowest | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th | 9th | Highest |
|---|---|---|---|---|---|---|---|---|---|---|
| $ a year | −1,214 | −392 | 23 | 379 | 797 | 1,211 | 1,673 | 2,213 | 3,208 | 13,622 |
| % of income | −3.1 | −0.6 | 0.1 | 0.4 | 0.8 | 1.0 | 1.2 | 1.3 | 1.5 | 2.7 |
| Share of total | −6.0 | −1.9 | 0.1 | 1.8 | 3.8 | 5.8 | 7.8 | 10.1 | 14.6 | 63.9 |

*Source: CBO distribution tool for P.L. 119-21, August 11, 2025 (`data/cbo_household_resources_all_deciles.csv`). Average for 2026–2034 in 2025 dollars. Excludes tariffs, interest on the added debt and economic feedback.*

## 3. Who gets the tax cut

| Income group, 2027 | Tax cut, $ billions | Share of total |
|---|---|---|
| Lowest fifth | 4.1 | 0.8% |
| Second fifth | 21.6 | 4.0% |
| Middle fifth | 44.1 | 8.1% |
| Fourth fifth | 97.2 | 17.8% |
| 80th–90th percentile | 77.0 | 14.1% |
| 90th–95th | 57.1 | 10.5% |
| 95th–99th | 112.6 | 20.6% |
| 99th–99.9th | 71.6 | 13.1% |
| Top 0.1% | 59.9 | 11.0% |
| **All taxpayers** | **545.3** | **100%** |

*Source: JCT JCX-33-25 (`data/jct_tax_change_by_income_quantile_2027.csv`). Shares are Mandate calculations. The top 1% begins at about $526,000 of size-adjusted income and the top 0.1% at about $2.04 million.*

By dollar income, tax units at $1 million and above receive $113.6 billion (20.8%), and their average federal tax rate falls from 31.1% to 27.8%. Tax units under $15,000 pay $0.5 billion more in 2027 (`data/jct_tax_change_by_income_category.csv`).

## 4. Health and food aid

| Measure | Figure | Source |
|---|---|---|
| Medicaid provisions, 10 years | −$989.7B | CRS R48633, citing CBO |
| of which work requirement | −$325.6B | CRS R48633 |
| Nutrition provisions, 10 years | −$186.7B | CRS R48552, citing CBO |
| More uninsured in 2034 | 10.0 million | CRS R48633, citing CBO |
| SNAP recipients, July 2025 | 41,603,048 | USDA |
| SNAP recipients, July 2026 | 36,087,667 | USDA |

SNAP enrollment fell in every one of the twelve months after the law was signed, by 5.5 million people (13.3%) in all (`data/usda_snap_monthly_participation.csv`). USDA's data do not record why people leave, and enrollment was already drifting down in the first half of 2025.

The Medicaid and SNAP cost breakdowns are in the earlier brief's `data/obbba_budget_and_coverage_effects.csv` and are not duplicated here.

## 5. Immigration enforcement

| Measure | Before | After | Source |
|---|---|---|---|
| ICE funding | $10.0B a year (FY2025) | +$74.85B through FY2029 | CRS R48704 |
| ICE detention funding | $2.4B a year | +$45B through FY2029 | CRS R48704 |
| Average daily detained population | 39,314 (Jan 20, 2025) | 67,204 (Apr 1, 2026) | GAO |
| Authorized detention facilities | 134 | 239 | GAO |
| ICE deportations | about 59,000 (FY2021) | 483,200 (FY2026) | DHS |
| ICE arrests | about 74,000 (FY2021) | more than 491,000 (FY2026) | DHS |
| Deaths in ICE custody | 12 (FY2024) | 24 (FY2025), 36 (FY2026 to Aug 23) | ICE |

GAO's June 2026 audit of Camp East Montana, a 5,000-bed tent facility at Fort Bliss under a contract worth up to $1.3 billion, found:

- **Waste:** up to $11.5 million in the first two weeks and about $7.5 million more for meals that were not needed.
- **No inspection:** ICE housed people there without the pre-occupancy inspection its own policy requires. The site opened without perimeter cameras, outdoor recreation space or room for attorney visits.
- **Deaths:** one January 2026 death by use of force was ruled a homicide by asphyxia. The contractor did not file the required reports, and evidence was missing or destroyed. A second death that month was a suicide after staff left the person unattended.
- **Response:** DHS agreed with all four recommendations.

Detention and deaths began rising in early 2025, before the law's money arrived in July.

## 6. What the administration points to

- **97%** of filers got a tax cut compared with letting the 2017 cuts expire; nearly 70% of them earned under $100,000 (Treasury).
- **$82 billion** in individual relief claimed through the April 2026 deadline (Treasury).
- **7.5 million** filers claimed the tips deduction and **29 million** the overtime deduction (Treasury; `data/treasury_filing_season_takeup_2026.csv`).
- DHS presents the fiscal 2026 arrest and deportation totals as agency records it set out to reach.

These count who claimed a break. The CBO and JCT tables above count where the dollars went.

---

## Files

```
README.md                         this brief
big-beautiful-bill-ledger.pdf     10-page PDF of the charted report
page/index.html                   the same report as a self-contained page (charts drawn in the browser)
data/cbo_budget_totals.csv
data/cbo_household_resources_all_deciles.csv
data/jct_tax_change_by_income_quantile_2027.csv
data/jct_tax_change_by_income_category.csv
data/usda_snap_monthly_participation.csv
data/treasury_filing_season_takeup_2026.csv
data/immigration_enforcement.csv
```

There is no `build_charts.py` here. The charts are drawn by the script inside `page/index.html` from values written into that file, so a change to a CSV must also be made in the page. The page loads its fonts from Google Fonts and falls back to system fonts offline.

## Sources

- CBO, [Estimated Budgetary Effects of Public Law 119-21](https://www.cbo.gov/publication/61570) (July 21, 2025)
- CBO, [Effects on Deficits and the Debt of Public Law 119-21](https://www.cbo.gov/publication/61466) (August 4, 2025)
- CBO, [How the 2025 Reconciliation Act Will Affect the Distribution of Resources Available to Households](https://www.cbo.gov/interactive/2025-reconciliation-act) (August 11, 2025)
- Joint Committee on Taxation, [JCX-33-25 distribution tables](https://www.jct.gov/getattachment/1332c86f-04b9-4b89-a418-1df4804e7427/x-33-25.pdf)
- CRS [R48611](https://www.everycrsreport.com/reports/R48611.html) (tax), [R48633](https://www.everycrsreport.com/reports/R48633.html) (health), [R48552](https://www.everycrsreport.com/reports/R48552.html) (SNAP), [R48704](https://www.congress.gov/crs-product/R48704) (homeland security)
- USDA Food and Nutrition Service, [SNAP data tables](https://www.fna.usda.gov/pd/supplemental-nutrition-assistance-program-snap) (data as of October 9, 2026)
- U.S. Treasury, [press release SB-0517](https://home.treasury.gov/news/press-releases/sb0517) (June 2, 2026)
- IRS, [filing season statistics for week ending May 8, 2026](https://www.irs.gov/newsroom/filing-season-statistics-for-week-ending-may-8-2026)
- GAO, [GAO-26-108886, Immigration Detention: Waste and Performance Issues at Camp East Montana](https://files.gao.gov/reports/GAO-26-108886/index.html) (June 9, 2026)
- DHS, [ICE Breaks Records in Fiscal Year 2026](https://www.dhs.gov/news/2026/11/12/ice-breaks-records-fiscal-year-2026-most-arrests-and-deportations-agencys-history) (November 12, 2026)
- ICE, [Detainee Death Reporting](https://www.ice.gov/detain/detainee-death-reporting)
- Office of Government Ethics, [the president's certified annual financial disclosure](https://www.oge.gov/web/oge.nsf/Resources/Now+Available:+The+President%E2%80%99s+and+Vice+President%E2%80%99s+certified+annual+financial+disclosure+reports) (June 30, 2026)
