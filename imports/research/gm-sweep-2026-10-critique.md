**GREATER MANCHESTER RESEARCH SWEEP: COMPLETENESS AND CONSISTENCY REVIEW (2026-10-11)**

**MISSING**

All 25 never-researched metrics, the 3 re-sourcing proposals and the 3 investigations have a final status. Tally for the 25:
- **Real (6):** active_transportation_mode_share, housing_starts, business_formation, university_spinouts, commercial_rd_investment, skills_training_participation.
- **Estimated (1):** public_transport_expansion_miles.
- **Pending a founder decision (1):** average_commute_minutes. The verifier found one 2014 GM row; otherwise it is unavailable.
- **Unavailable (17):** bike_infrastructure_miles (verifier overturned the researcher's "estimated"), housing_permits_issued, homelessness_count, planning_approval_days, vacancy_rate, startup_formation, ai_companies, patent_creation, vc_investment, agency_vacancy_rate, digital_government_adoption, major_infrastructure_delivery_rate, permit_approval_days, planning_efficiency_index, procurement_timeline_days, graduate_employment_rate, bond_rating_index.

The 3 re-sourcing proposals and the 3 investigations (median_rent, labor_force_participation, apprenticeships) were all confirmed as real.

Gaps that remain inside series that are otherwise done:
- commercial_rd_investment has no data for 2015-2021. ONS published no ITL2 table before 2022, so this is a permanent gap.
- university_spinouts has no AY2023-24 row. HESA serves a Cloudflare challenge that we did not bypass, so a human needs to check it in a normal browser.
- median_rent has nothing after FY2022-23. The series was discontinued and the replacement (PIPR) has no GM geography and no median.
- capital_budget_execution_rate was not covered by any batch. The precedent says GM uses actual / latest forecast while Durham uses outturn / latest revised budget, and that is still unreconciled.
- The verifier's doubt about Tameside in the existing GM housing_completions row is not resolved. Tameside's FY2025-26 completions in LT253 are 30, against 470 in FY2023-24, which looks like missing building-control returns.

Evidence trail is thin, with the verdict resting on the Durham precedent alone:
- permit_approval_days and planning_efficiency_index: neither the researcher nor the verifier opened a URL.
- vacancy_rate: the researcher opened none. The verifier supplied two GMCA URLs, which should be added to the stored reason.

**GEOGRAPHY ISSUES**

- **Two existing rows are Manchester-district only and must be retired:**
  - median_rent 2026 = 1352. This is the PIPR value for E08000003 (Manchester district), and it is a geometric mean, not a median.
  - labor_force_participation 2023 = 71.4. This is Manchester district's employment rate, not GM's economic activity rate.
  - The replacements for both are published GM-level figures: Table 2.7 row E11000001 for rent, and Nomis NM_17_5 geography E47000001 for participation.
- **No averaged medians, means or rates were used.**
  - The only commute figure proposed is ONS's own published 2014 Met County mean.
  - The researcher's weighted estimates (28.05 and 29.39, which treat suppressed cells as zero) were rightly not used.
  - Wigan-only LOSI and Manchester City digital-maturity material were rightly rejected.
- **No borough is missing from any sum.** Every 10-borough sum was re-derived and matches the published Met County, EDA or LEP row to within rounding.
  - housing_starts FY2024-25 and FY2025-26 look under-reported rather than missing: Tameside 40 in both years, and Manchester 420 in FY2024-25. Downgrade FY2025-26 to "estimated" (the verifier's call, naming Tameside). Applying the same to FY2024-25 is my suggestion, since Manchester's 420 is the same kind of outlier.
  - Places for Everyone material covers only 9 boroughs (no Stockport). It was correctly not used.
- **Census geographies.** The 2011 Met County E11000001 and 2021 LEP E37000015 geographies are verified equal to the 10-borough sum, so they are acceptable.
- **Durham-side note, which predates this sweep.** Durham's FIRE1001 fire authority (County Durham and Darlington) also covers Darlington, while GMFRS matches the 10 boroughs exactly. This is from general knowledge and was not checked in this sweep.

**COMPARABILITY ISSUES**

1. **business_formation vintage rule.** GM takes each year from the latest edition. Durham's imported 2015-2018 rows come from the 2018 edition. Durham's latest-vintage values for 2016-2018 are 1770, 1565 and 1565, not 1805, 1610 and 1610. Either restate Durham, or GM would need 20535, 23590 and 21535 for 2016-2018, which are heavily revised. Also check that GM's source-name string exactly matches Durham's stored string.
2. **skills_training_participation label error, Durham side.** "FES Total" includes 19+ apprentices. Durham's sources.ts and CSV notes say "excluding apprenticeships", which is wrong. GM follows Durham's actual measure, so the numbers are comparable; only the label needs fixing for both jurisdictions. It also overlaps with the apprenticeships metric (GM AY2024-25 has 33,840 apprentices aged 19+), so the two must never be added together.
3. **apprenticeships, Durham side.** Durham's AY2015-16 to AY2018-19 gap-fill values are 16-20% below the EES figures: 11,587, 11,872, 9,406 and 7,277 against EES 13,860, 14,070, 11,400 and 9,130. They need re-pulling from EES e79b99cb and f8a1e560 before any 2015-2019 comparison. There is also a minor method mix within GM (EDA totals from 2017/18, LAD sums before), differing by 0-20 and disclosed.
4. **average_commute_minutes.** Durham has 2015 and 2016 only; GM has 2014 only, so there is no shared year. Comparability needs Durham 2014 (24.10, same sheet) added. The verifier did not confirm that the 2014 sheet's "20 Durham" row matches the County Durham UA boundary (E06000047).
5. **public_transport_expansion_miles.** The researcher scoped it to Metrolink and BRT, but Durham's definition counts all new rail. The verifier corrected 2017 to include the Ordsall Chord: 0.43 becomes 0.62 mi. Use the corrected rows.
6. **emergency_response_minutes.** Copy Durham's stored data_quality and publisher strings exactly. The researcher left data_quality conditional on Durham's.
7. **labor_force_participation.** Same concept as Durham, but Durham's 2022 and 2023 rows come from an ONS visualisation (100 minus inactivity), and Durham also has an FY2024-25 row that GM lacks. A GM year-to-March 2026 row (75.6) is available if wanted.
8. **median_rent.** No Durham precedent exists. The same Table 2.7 gives County Durham E06000047 (450 to 495), so Durham's median_rent should be aligned to this source if it uses anything else.
9. **commercial_rd_investment.** GM is real while Durham stays unavailable. Durham's stored reason should be reworded: ITL2 exists, but County Durham sits inside the larger ITL2 areas "Tees Valley and Durham" and "Northumberland, Durham and Tyne and Wear".
10. **Period types.** Confirm that GM's uk_academic_year rows (period_start YYYY-08-01, used for spinouts, apprenticeships and skills) match Durham's stored convention.
11. **Unchanged from earlier, still unreconciled:** the capital_budget_execution_rate denominator (GM uses forecast, Durham uses revised budget).

**LICENCE FLAGS**

- Every imported source is Open Government Licence v3, except HESA, which is CC BY 4.0. Both permit commercial reuse with attribution.
- **Barred and correctly rejected:**
  - British Business Bank tracker (Beauhurst data): terms clause 5.5 forbids commercial use without a licence. This was the vc_investment figure of 84 deals and £354m.
  - Shelter homelessness estimates.
  - Commercial trackers: Beauhurst, Dealroom, PitchBook, Glass.ai.
- **public_transport_expansion_miles** relies on trade press and contractor pages (VolkerRail, Transport Network, Railway Gazette, Rail Engineer, EIB) for facts only. That is low risk as long as no text is reproduced. The Ordsall Chord's roughly 300 m length rests on Rail Engineer alone.
- **Policy consistency.** The US jurisdictions (NYC, Minneapolis) use PitchBook-derived VC figures relayed through NYCEDC and NVCA. Whatever licence rule rejects BBB here should be applied to those too.
- If a bike snapshot is ever used, the TfGM layer requires this exact attribution: "Contains Transport for Greater Manchester data. Contains OS data © Crown copyright and database right 2026."

**HUMAN DECISIONS NEEDED**

1. **average_commute_minutes:** accept the 2014 GM point (28.68), which falls before the 2015 target window, and add Durham 2014 (24.10)? Or mark it unavailable? The researcher said unavailable; the verifier said real with this one row. The verifier set confidence to "high" despite ONS's small-sample warning; match Durham's confidence label instead.
2. **bike_infrastructure_miles:** the researcher proposed 6 estimated rows (451.5 to 552.6 mi); the verifier rejected it. The reasons:
   - About 40% of the counted length is mountain-bike-only surface.
   - Code 4, which contains segregated tracks, is excluded.
   - Status coding is inconsistent between editions.
   - Year-to-year change mostly reflects recoding.

   Recommendation: unavailable, matching Durham. The optional fallback is a single 2026 snapshot of about 334.7 mi, never used as a time series.
3. **business_formation:** restate Durham 2016-2018 to the latest vintage (recommended), or import GM on superseded values.
4. **Durham corrections:** approve the apprenticeships 2015/16-2018/19 re-pull and the skills label fix.
5. **public_transport_expansion_miles 2017:** two judgment calls. The Second City Crossing split (0.7 km, or 1.3 km if the whole length is counted in 2017) and the Ordsall Chord's length (300 to 350 m).
6. **housing_starts FY2024-25 and FY2025-26:** show them with "estimated" confidence and a caveat naming Tameside, or hold them until the December 2026 revision. Also decide whether to re-examine the existing housing_completions FY2025-26 row.
7. **Replace the six existing GM rows listed below (all supported by the evidence):** transit_ridership, transit_reliability, emergency_response_minutes, median_rent, labor_force_participation, apprenticeships.
8. **university_spinouts AY2023-24:** someone with normal browser access needs to check HESA.
9. **VC and startup licence policy:** decide whether to seek a BBB licence, and whether to apply the same rule to the US PitchBook-derived figures.

**OVERALL READINESS**

**Can import now** (with the small edits noted):
- active_transportation_mode_share: 2 rows, 2011 and 2021.
- public_transport_expansion_miles: 11 rows, using the verifier's corrected rows (2017 = 0.62; drop the leigh.town 7.5 km reference, which the verifier could not find in that document).
- housing_starts: 11 rows, with FY2025-26 downgraded to "estimated" and the Tameside caveat (FY2024-25 too, per decision 6).
- university_spinouts: 9 rows.
- commercial_rd_investment: 3 rows, imported with currency GBP.
- skills_training_participation: 9 rows, labelled "includes 19+ apprenticeships".
- business_formation: 10 rows, once decision 3 is made.
- All 17 unavailable records. Two need text edits first: soften the homelessness wording about A Bed Every Night, and add the GMCA URLs to vacancy_rate.

**Hold:** average_commute_minutes until decision 1. bike_infrastructure_miles imports as unavailable unless the founder overrides.

**Replaces existing GM rows if approved:**
- **transit_ridership:** the Metrolink-only 2024 row becomes 10 BUS01e bus-only rows, FY2015-16 to FY2024-25.
- **transit_reliability:** the TfGM March 2025 row becomes 10 BUS09a rows. Fix the citation to "November 2025 release"; the caveat wrongly says the table was last updated March 2026.
- **emergency_response_minutes:** the GMFRS 7.35 composite becomes 11 FIRE1001 primary-fire rows, FY2015-16 to FY2025-26. Re-check FY2025-26 after the 28 October 2026 update.
- **median_rent:** delete the 2026 row (1352) and import 8 FY rows, FY2015-16 to FY2022-23. Use currency GBP and period type uk_fiscal_year, reseed once after the import, and show the ONS "do not compare across time periods or between areas" footnote.
- **labor_force_participation:** retire the 71.4 row and import 11 rows, 2015-2025, from E47000001.
- **apprenticeships:** replace all 10 starts rows with participation rows. Retitle the dfe_apprenticeships_gm source, which is currently titled "Starts by English Devolved Area".

Every row claimed as real was re-derived by the verifier with zero mismatches. Some points the verifier did not re-derive itself:
- the AY2015-16 exclusion for skills (taken from the Durham precedent);
- AY2023-24 spinouts;
- the TICM AI report (it only supports an unavailable status);
- the 2014 commute row, which the verifier found itself, so no second researcher has checked it.

One small difference in the skills evidence: the researcher gives Durham community learning as 6,530 and the verifier as 6,510. It does not change any value.