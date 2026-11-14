# The 2025 budget law in numbers: tax breaks, who gains, the safety net and immigration enforcement (November 2026)

**Scope:** United States, national. Public Law 119-21, the "One Big Beautiful Bill Act", signed July 4, 2025.
**Pulled:** 2026-11-14. **Status:** research files for review. Nothing in the seed data or import CSVs was changed.

This brief extends [`tax-jobs-obbba-brief-2026-11`](../tax-jobs-obbba-brief-2026-11/README.md), which covered the law's effect on the average household using government sources only.

## Read this first: the source rule is looser here

The earlier brief used government statistical agencies and the Congressional Research Service. This one does not hold to that rule, because several of the questions asked have no government series.

- **Government and nonpartisan:** CBO (its distribution tool was readable this time), CRS, DHS, the Joint Committee on Taxation through the Bipartisan Policy Center.
- **Research groups with a known lean:** ITEP and the Center for American Progress lean left. The Tax Foundation generally favors lower taxes. KFF, the Migration Policy Institute, the Commonwealth Fund and TRAC are independent.
- **News and trackers:** NBC News, Time and Forbes, The Trace, and a Wikipedia list of shootings by immigration agents.

Every CSV row names its source and has a `verified_this_pull` column. Rows marked `no` or `partly` were written from recall of the source and must be checked before anything is published. They are: the FY2021–FY2024 deportation counts, the SNAP and defense spending totals, and one of the three net worth figures.

**Two things need a decision before any of this goes on the site:**

1. **Medicaid total.** This brief uses KFF's $911 billion. The earlier brief and the published Finding use $989.7 billion from CRS R48633. The two are not calculated the same way and should be reconciled.
2. **Shootings count.** The quarterly chart is a Mandate count of 41 dated rows in a Wikipedia list. It is not a government source and does not meet `CONTRIBUTING.md`'s bar for a named, specific source at the tier it claims.

---

## The answers at a glance

| Question | Short answer |
|---|---|
| **What does the law cost?** | **$3.4 trillion** added to deficits over 2025–2034 before interest (CBO). About $4.5 trillion in net tax cuts against about $1.1 trillion in health and food cuts (Bipartisan Policy Center). CBO's February 2026 outlook puts the addition to debt at **$4.7 trillion** with interest (as reported by NBC News). |
| **Who gains and who loses?** | CBO, taxes and benefits combined, 2026–2034 average: the lowest tenth of households loses **$1,214 a year (−3.1%)**; the highest tenth gains **$13,622 (+2.7%)**. The top tenth receives **63.9%** of the total net gain. |
| **What do the top 1% get?** | ITEP puts the average 2026 tax cut for households above $960,600 at **more than $70,000**, against $1,160 for the middle fifth. |
| **How has the president benefited?** | No reliable dollar figure exists. His returns are not public and no independent estimate was found. Several provisions fit the way his wealth is held. His net worth rose from $3.9 billion to $7 billion (Forbes), mostly from crypto and licensing, which the law did not create. |
| **What has happened to health and food aid?** | About **4.1 million** fewer people on SNAP by March 2026 (NBC News from USDA data). **10 million** more uninsured projected by 2034 (CBO). Nearly two thirds of the Medicaid cut lands after fiscal 2030 (KFF). |
| **What did it do for immigration enforcement?** | **$74.85 billion** for ICE through fiscal 2029, on a regular budget of about $10 billion a year (CRS). Detention rose from about 39,000 to about 66,000. DHS reports 483,200 deportations in fiscal 2026. At least 60 people have died in ICE custody this term (MPI). |

---

## 1. The tax side

Most of the cost is the 2017 tax cuts made permanent. The new deductions for tips, overtime, seniors and car loans are small by comparison and expire after 2028.

| Largest costs, 10 years | $ billions | Largest offsets, 10 years | $ billions |
|---|---|---|---|
| Lower individual tax rates | 2,190 | Personal exemptions repealed | −1,900 |
| Larger standard deduction | 1,420 | State and local deduction cap | −946 |
| Alternative minimum tax relief | 1,360 | Miscellaneous itemized deductions | −233 |
| Child tax credit | 817 | EV credits ended | −191 |
| Pass-through deduction | 737 | Health insurance credit limits | −185 |
| Bonus depreciation | 363 | Clean electricity investment credit ended | −166 |
| Estate tax exemption | 212 | Home energy credits ended | −105 |

*Source: Bipartisan Policy Center, from JCT scores (`data/tax_provisions_10yr_cost.csv`, 22 provisions).*

## 2. Who gains, who loses

The earlier brief could only show the bottom, middle and top groups because CBO's files were blocked. The full table is now in `data/cbo_household_resources_all_deciles.csv`.

| Decile | Lowest | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th | 9th | Highest |
|---|---|---|---|---|---|---|---|---|---|---|
| $ a year | −1,214 | −392 | 23 | 379 | 797 | 1,211 | 1,673 | 2,213 | 3,208 | 13,622 |
| % of income | −3.1 | −0.6 | 0.1 | 0.4 | 0.8 | 1.0 | 1.2 | 1.3 | 1.5 | 2.7 |
| Share of total | −6.0 | −1.9 | 0.1 | 1.8 | 3.8 | 5.8 | 7.8 | 10.1 | 14.6 | 63.9 |

*Source: CBO distribution tool for P.L. 119-21, August 11, 2025. Average for 2026–2034 in 2025 dollars.*

ITEP's October 2026 estimates give a taxes-only view by income group and a second view that adds tariff and price effects and the lapsed health-insurance credits (`data/itep_tax_and_cost_change_2026.csv`). On the second view every group except the top 1% pays more in 2026. That view includes policies outside this law.

## 3. The top 1% and the president

- **Top 1%:** more than $70,000 average tax cut in 2026 (ITEP).
- **Provisions weighted to the top 10%:** $2.3 trillion over ten years (Center for American Progress, from JCT scores): business tax cuts, the pass-through deduction, the top-rate cut and the estate tax cut.
- **Estate tax:** exemption of $15 million per person from 2026, permanent and indexed.

**The president.** The provisions that match a real estate business held through pass-through entities are the 20% pass-through deduction, 100% bonus depreciation, the looser limit on business interest deductions, the estate tax exemption, the 37% top rate and the permanent opportunity zone program. How much any of these saves him is unknown. The descriptions of how each fits his holdings are Mandate's characterisation, not a sourced finding.

Forbes estimated his net worth at $3.9 billion in 2024 and $7 billion in September 2026, and attributes most of the rise to crypto ventures and overseas licensing. That is wealth gained in office. It is not an effect of the tax law.

## 4. Health and food aid

| Measure | Figure | Source |
|---|---|---|
| Additional uninsured, 2026 → 2034 | 1.3M → 10.0M | CBO, as charted by NBC News |
| Federal Medicaid cut, FY2027 → FY2034 | $46B → $165B a year | KFF |
| SNAP recipients, change July 2025 → March 2026 | −4.1 million | NBC News from USDA data |
| Rural hospitals at risk of closing | more than 700 | Center for Healthcare Quality and Payment Reform |
| Rural health fund vs rural Medicaid cuts | $50B vs $137B | KFF |

Not all of the SNAP decline is due to the law. Enrollment was already falling in some states before July 2025.

## 5. Immigration enforcement

| Measure | Before | After | Source |
|---|---|---|---|
| ICE funding | $10.0B a year (FY2025) | +$74.85B through FY2029 | CRS R48704 |
| Detention funding | $2.4B a year | +$45B through FY2029 | CRS R48704 |
| People detained | about 39,000 (Jan 2025) | 65,765 (Jul 2026) | MPI, TRAC |
| Detention facilities | 134 | 272 | MPI |
| Deportations (DHS count) | 271,484 (FY2024) | 483,200 (FY2026) | ICE, DHS |
| Deaths in custody | 26 in four years (Biden) | at least 60 in 21 months | MPI |

Caveats that matter:

- **Timing.** Detention and deaths began rising in early 2025, before the law's money arrived in July. A second law in 2026 added more funding.
- **Deportation counts.** DHS totals for fiscal 2025 and 2026 include voluntary departures. TRAC found formal removals were 63% of the DHS total in July and August 2026.
- **Shootings.** Trackers disagree: The Trace counts 32 incidents and 9 deaths; the Wikipedia list's summary cites at least 43 and 11. Both include exchanges of fire. DHS says agents acted in self-defense in most cases; in several, video, witnesses or prosecutors contradicted the official account.

## 6. What supporters point to

- **62%** of taxpayers would have faced a tax increase in 2026 had the 2017 cuts expired (Tax Foundation).
- **$3,813** average tax cut per filer in 2026 counting business cuts, falling to $2,590 in 2030 (Tax Foundation).
- **+0.7%** long-run GDP and about 828,000 full-time-equivalent jobs (Tax Foundation).
- **About 70%** of filers getting a cut this year earned under $100,000 (Treasury, as reported by NBC News).
- DHS presents the fiscal 2026 arrest and deportation totals as agency records it set out to reach.

---

## Files

```
README.md                         this brief
big-beautiful-bill-ledger.pdf     12-page PDF of the charted report
page/index.html                   the same report as a self-contained page (charts drawn in the browser)
data/tax_provisions_10yr_cost.csv
data/spending_side_10yr.csv
data/cbo_household_resources_all_deciles.csv
data/itep_tax_and_cost_change_2026.csv
data/coverage_and_benefits_series.csv
data/immigration_enforcement.csv
data/agent_shootings_by_quarter.csv
data/trump_net_worth_forbes.csv
```

There is no `build_charts.py` here. The charts are drawn by the script inside `page/index.html` from values written into that file, so a change to a CSV must also be made in the page. The page loads its fonts from Google Fonts and falls back to system fonts offline.

## Sources

- CBO, [budget estimate for P.L. 119-21](https://www.cbo.gov/publication/61570) and [distribution tool](https://www.cbo.gov/interactive/2025-reconciliation-act)
- Bipartisan Policy Center, [tax provisions explorer](https://bipartisanpolicy.org/explainer/one-big-beautiful-bill-act-tax-provisions-explorer/) and [cost explainer](https://bipartisanpolicy.org/explainer/what-does-the-one-big-beautiful-bill-cost/)
- ITEP, [Impact of Key Trump Policies on Taxes and Costs](https://itep.org/impact-of-trump-policies-on-taxes-and-consumer-costs-2026/) (October 2026)
- Tax Foundation, [OBBBA analysis](https://taxfoundation.org/research/all/federal/big-beautiful-bill-senate-gop-tax-plan/) and [average tax cut map](https://taxfoundation.org/data/all/federal/obbba-average-tax-cuts-impact-map/)
- Center for American Progress, [7 Ways the Big Beautiful Bill Cuts Taxes for the Rich](https://www.americanprogress.org/article/7-ways-the-big-beautiful-bill-cuts-taxes-for-the-rich/)
- NBC News, [one-year review of the law](https://www.nbcnews.com/news/us-news/trump-big-beautiful-bill-act-tax-medicaid-snap-one-year-rcna351211)
- KFF, [rural health fund and Medicaid cuts](https://www.kff.org/medicaid/a-closer-look-at-the-50-billion-rural-health-transformation-program/) and [deaths in ICE detention](https://www.kff.org/racial-equity-and-health-policy/deaths-and-health-care-issues-in-ice-detention-centers-under-the-second-trump-administration/)
- Commonwealth Fund, [H.R. 1 funding cuts and the rural health program](https://www.commonwealthfund.org/publications/issue-briefs/2026/jun/hr-1-funding-cuts-rural-health-transformation)
- CRS R48704, [Understanding the FY2026 DHS Budget Request](https://www.congress.gov/crs-product/R48704)
- American Immigration Council, [The Cost of Immigration Enforcement and Border Security](https://www.americanimmigrationcouncil.org/fact-sheet/the-cost-of-immigration-enforcement-and-border-security/)
- Migration Policy Institute, [ICE's detention network and record deaths](https://www.migrationpolicy.org/journal/policy-beat/ice-mandatory-detention-deaths)
- TRAC, [immigration detention quick facts](https://tracreports.org/immigration/quickfacts/) and [removals report](https://tracreports.org/reports/783/)
- DHS, [fiscal 2026 arrests and deportations release](https://www.dhs.gov/news/2026/11/12/ice-breaks-records-fiscal-year-2026-most-arrests-and-deportations-agencys-history)
- The Trace, [shootings tracker](https://www.thetrace.org/2025/12/immigration-ice-shootings-guns-tracker/); Wikipedia, [list of shootings by immigration agents](https://en.wikipedia.org/wiki/List_of_shootings_by_U.S._immigration_agents_in_the_second_Trump_administration)
- Time, [Trump's net worth in his second term](https://time.com/article/2026/11/10/trump-net-worth-second-term/), citing Forbes
