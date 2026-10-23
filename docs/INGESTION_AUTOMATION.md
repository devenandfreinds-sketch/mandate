# Ingestion Automation Scoping (October 2026)

Which metrics can refresh themselves from scheduled official datasets, so the paid Civic API tier's
"live data" is genuinely current. Read-only scoping pass; nothing is built yet. See
`docs/DATA_RELEASES.md` for how live vs. released data is served.

**Bottom line:** about a quarter of the 48 metrics can refresh automatically, almost all of them
labour-market, housing-supply and census metrics that are published monthly, quarterly or annually.
Fiscal health, government capacity, most transit and most US crime metrics stay researcher-maintained,
as do all pipeline assessments. "Live" should be promised as **"refreshed within days of each official
release"**, not real time.

## Verified reproductions

Before recommending a feed, the scoping pass checked that its API returns exactly the values Mandate
already has:

- Nomis ASHE (median annual gross pay, all employee jobs): Durham 2023-25 and GM 2024-25 match exactly.
- Nomis BRES (SIC 58-63 employees): Durham and the 10-borough GM sum match exactly for 2018 and 2024.
- BLS QCEW open data (NAICS 5415, DC, 2023): matches exactly (22,488).
- BLS LAUS (Chicago 2025 annual average 4.9): matches. Other years probably need the free API key.
- Census API: now requires a key, so ACS values were not reproduced.

## Recommended first batch

| # | Feed | Metrics | Cadence | Access / licence | Effort |
|---|---|---|---|---|---|
| 1 | Nomis API (ASHE, BRES, APS, modelled unemployment) | median_wages, tech / life_sciences / advanced_manufacturing_employment, employment, unemployment_rate, labor_force_participation (UK) | ASHE annual (provisional, then revised); BRES about 9 months after the reference year; APS quarterly | No key needed; OGL v3 (commercial reuse with attribution) | S |
| 2 | BLS LAUS API and QCEW files | unemployment_rate, employment, industry employment (US) | LAUS monthly; QCEW quarterly | Free key; public domain | S-M |
| 3 | Census ACS 1-year API | median_rent, vacancy_rate, average_commute_minutes, active_transportation_mode_share, labor_force_participation | Annual, in September | Key required; public domain, but a required non-endorsement notice | S-M |
| 4 | Census BPS and BFS bulk files | housing_permits_issued, business_formation | BPS annual (May); BFS monthly | No key; public domain | S |
| 5 (optional) | ONS police force area crime tables | crime rates (GM; Durham via its community safety partnership area) | Quarterly | OGL v3 | M |

Feed 1 also fills GM's missing median-wage history for 2015-23 immediately.

## Coverage

- **Automatable:** unemployment_rate, employment (see the mismatch below), the three industry-employment
  metrics, median_wages, median_rent (not NYC), housing_permits_issued (US), commute and mode share
  (US), vacancy_rate (Chicago, Minneapolis, Seattle), business_formation (most).
- **Partly automatable:** labor_force_participation, housing starts and completions, affordable housing
  completions, crime (GM yes; US cities deliberately use local sources over FBI NIBRS),
  business_survival_rate, apprenticeships and skills, transit ridership and reliability, city-portal
  metrics (permit days, agency vacancy, procurement), homelessness_count, bike_infrastructure_miles,
  startup_formation.
- **Never automated:** budget_balance, capital_investment, debt_per_capita, pension_funding_ratio,
  bond_rating_index, vc_investment, ai_companies, university_spinouts, commercial_rd_investment,
  patent_creation, graduate_employment_rate, public_transport_expansion_miles,
  emergency_response_minutes, the four government-capacity indices, and every PipelineAssessment.

## Licensing red flags (resolve before selling)

1. **Municipal bond credit ratings:** 55 rows, `financial_data`, no URL, and Chicago's rows are wrongly
   labelled `government` quality. Moody's, S&P and Fitch restrict redistribution. Exclude from the paid
   API pending legal review.
2. **PitchBook-NVCA Venture Monitor:** "All Rights Reserved", and mis-typed `academic`. Sources that
   repeat PitchBook figures (Technical.ly, the NVCA district one-pager, NYCEDC) inherit the problem.
   Exclude vc_investment.
3. **Zillow** (Seattle 2025 median_rent) and **Built In Chicago** (ai_companies) are on commercial terms.
4. **DataUSA** states no licence. Re-source those rows from Census directly; the underlying data is public domain.
5. Advocacy and news sources are low risk for facts, but must be attributed.
6. Not yet checked: WASPC, HESA, and the Chicago, NYC and Seattle open-data portal terms.
7. **Obligations:** OGL v3 requires attribution and allows no implied endorsement. The Census API
   requires its non-endorsement notice.
8. Nothing in `docs/` records source licences today. A per-Source `redistribution` field, with the paid
   API excluding restricted sources, is the minimum.

## Engineering requirements for a feed

- **Source-scoped writes.** `importRunner.ts` overwrites any row matching (metric, jurisdiction, period
  type, period start), whatever its source. A feed must only update rows whose Source is that same feed,
  and flag the rest. Example: Seattle's 2024 tech value was deliberately re-sourced by a researcher.
- **One recipe per (metric, jurisdiction)**, encoding the exact series, geography and aggregation
  already used. Medians are never summed across GM boroughs.
- **A regression test per recipe** that reproduces known values before any write, as the scoping pass did.
- **Revision and suppression handling** (ASHE provisional to revised; QCEW suppressed cells), with
  `ingestionMethod: "api"` and `nextReviewDate` set.
- **A review queue:** changes above a threshold wait for a researcher. Writes land in live data only,
  and the public sees them at the next release cut.
- **A scheduled job** (Railway cron) per feed, timed to each publisher's release calendar.

## Methodology mismatches found in passing (founder decisions)

1. **employment:** Chicago counts employed residents, while the other US cities count jobs. These are different concepts.
2. Seattle's unemployment_rate uses a December value, not an annual average.
3. Tech employment industry baskets and geographies differ by US city.
4. GM labor_force_participation and GM median_rent rows are Manchester district only, not GM.
5. GM unemployment is modelled, while Durham's is raw APS. ONS has suspended the modelled series pending a 2026 reweighting.
6. **apprenticeships:** GM's figure looks like *starts* and Durham's like *participation*. This is inferred from magnitudes, not confirmed.
7. Metadata errors:
   - Durham housing_starts points at a "Permanent Dwellings Completed" source;
   - transit_reliability's primary source is NTD, which likely doesn't publish on-time performance;
   - patent_creation is attributed to "FRED, sourced from BLS".

## Open questions

1. Is "live" defined as "within N days of the official release"?
2. Should feeds freeze each city's current recipe, or standardise first (see the mismatches above)?
3. Should restricted sources (ratings, VC, Zillow) be dropped from the paid API, or licensed?
4. Should feed updates auto-apply to live data, or wait for reviewer approval?
5. Is replacing metro stand-ins with direct city figures allowed as a disclosed methodology change?
