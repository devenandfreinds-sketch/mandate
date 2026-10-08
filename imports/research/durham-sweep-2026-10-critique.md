MANDATE DURHAM SWEEP: COMPLETENESS AND CONSISTENCY CRITIC

MISSING

None. All 20 metrics have a final status:
- Real (4): transit_ridership, transit_reliability, average_commute_minutes, active_transportation_mode_share.
- Estimated (6): violent_crime_rate and property_crime_rate (both downgraded by the verifier), clearance_rate, emergency_response_minutes, capital_budget_execution_rate, public_transport_expansion_miles.
- Unavailable (10): bike_infrastructure_miles, agency_vacancy_rate, digital_government_adoption, major_infrastructure_delivery_rate, permit_approval_days, planning_efficiency_index, procurement_timeline_days, vacancy_rate, planning_approval_days, homelessness_count. homelessness_count is disputed: the verifier proposes estimated with Shelter rows (see Human decisions).

Gaps inside covered metrics:
- capital_budget_execution_rate has no FY2025-26 row. Report s226092 exists, but there is no Wayback copy and democracy.durham.gov.uk refuses connections from this machine. It needs a manual pull.
- transit_reliability has no FY2021-22 row, because DfT shows [z] for that year.
- transit_ridership ends at FY2024-25. The next DfT release is November 2026.
- average_commute_minutes has only two points (2015 and 2016).
- The proposed Shelter homelessness rows have no 2020 row.

CONSISTENCY ISSUES

1. Mixed geography within Public Safety. Two areas are in use:
   - violent_crime_rate and property_crime_rate use the County Durham CSP, which is the council area (E06000047).
   - clearance_rate uses the Durham Constabulary force area (County Durham plus Darlington). emergency_response_minutes uses the County Durham and Darlington fire authority area.

   So clearance is computed over a wider offence base than the crime rates beside it. Every row discloses this, and no council-level source exists. For contrast, all GM rows are force or authority level, which equals the GMCA area, so GM is internally consistent and Durham is not.

2. Population denominators for the crime rates.
   - FY2015-16 to FY2019-20 (derived): uses the original-vintage ONS mid-year estimate, taken from the year two before the financial year ends. This matches the ONS PFA table convention.
   - FY2020-21 to FY2025-26 (ONS-published): each row uses its own edition's vintage.
   - Exception: FY2024-25 uses mid-2022 (528,100). By the convention it should use mid-2023, which is what the force-level P3 table and GM's FY2024-25 row use. On mid-2023 the values would be about 3,406 violent instead of 3,443, roughly 1% lower, and property would fall by a similar amount.
   - The derived rows use Home Office counts revised in July 2026. The published rows use counts as first published. The difference is negligible (for example 20,848 vs 20,849).

3. Fiscal-year labelling. This is consistent: every uk_fiscal_year metric uses FYyyyy-yy with period_start on April 1, and the "year ending March YYYY" to FY(YYYY-1) mapping was verified for the DfT bus tables. The problem is across jurisdictions. GM's transit_ridership is calendar 2024 and GM's transit_reliability is labelled "2025" for a single month, while Durham uses uk_fiscal_year for both. Within one metric, the two jurisdictions sit on different period types.

4. Mixed period types and reference dates (disclosed, acceptable):
   - Commute: the LFS asks only in October to December, but rows are labelled as the calendar year with period_start January 1.
   - Census mode share: census day is in March, but rows start January 1.
   - Shelter homelessness: the reference date is 31 March for 2018 and 2019 and 30 June from 2021, so there is a break inside the series.

5. Units.
   - Crime per 100,000 as integers: OK.
   - All percentages are on a 0 to 100 scale: OK.
   - Fire response in decimal minutes: OK.
   - transit_ridership is stored as absolute journeys (for example 22,111,604). Check that GM's Metrolink row is also stored as journeys, not millions.

6. Vocabulary that may break the importer. The verifier's Shelter rows use confidence "modeled", data_quality "alternative" and source_type "advocacy_report". No other batch uses these values. Confirm the importer and schema accept them before any import.

7. Status labels within a metric. violent_crime_rate and property_crime_rate now mix row confidence "high" (ONS-published) with "estimated" (derived) under a metric-level status of estimated. That is consistent with the rule, but the same metric is "government" for GM.

COMPARABILITY ISSUES WITH GREATER MANCHESTER

Divergences that are disclosed but still produce a non-comparable pair:
- **transit_ridership:** Durham is bus only (DfT BUS01e), financial year, status real. GM is Metrolink only, calendar 2024, status estimated. A side-by-side compares buses with trams. GM's BUS01e row exists (171.04m for FY2024-25).
- **transit_reliability:** Durham is BUS09a, non-frequent services only, financial year, reported by the council. GM is TfGM whole-network on-time, March 2025 only. GM's BUS09a row exists (73 for FY2024-25).
- **emergency_response_minutes:** Durham is the mean response to primary fires from Home Office FIRE1001. GM's 7.35 is GMFRS's internal life-risk composite. On the FIRE1001 basis GM is 7.22 for primary fires (6.65 for dwellings). GM's 7.35 is also a mean but carries "government", while Durham's equivalent is "estimated". That is a status inconsistency in the existing GM row.
- **capital_budget_execution_rate:**
  - Denominator: Durham uses the latest Cabinet-approved revised budget, GM the latest forecast. Both are estimated, so this is acceptable.
  - Scope, not disclosed: Durham is General Fund capital only. The GMCA programme's scope (transport, fire and so on) is not stated against it.
  - Entity, not disclosed: a combined authority is being compared with a unitary council.

Divergences not flagged as GM differences:
- **Crime status gap:** violent_crime_rate and property_crime_rate will show "estimated" for Durham and "government" for GM on the same metric, purely because of the five derived pre-2020 rows. The cause is the derivation, not a concept difference, and a reader will not see that.
- **FY2024-25 population vintage:** Durham FY2024-25 crime uses mid-2022 while GM FY2024-25 uses mid-2023, a gap of about 1%.
- **Year coverage in the crime series:** Durham has a full FY2019-20 crime row. GM has none (GMP IT gap). This is harmless, but year-by-year charts will have an unmatched point.
- **clearance_rate year coverage:** Durham includes FY2025-26, which is provisional (6.6% of offences not yet assigned an outcome). GM stops at FY2024-25, although 14.93 is available by the identical method.
- **Geography of clearance and fire:** for Durham these include Darlington, while GM's force and fire areas equal GMCA. Per row this is disclosed. As a GM comparison it is not.

Method matches confirmed by reproduction:
- clearance_rate reproduces all nine GM values exactly.
- violent_crime_rate and property_crime_rate match GM's offence groups and conversion (robbery under property, fraud excluded).

HUMAN DECISIONS NEEDED

1. **violent_crime_rate and property_crime_rate status.** The researcher submitted real/government and the verifier corrected this to estimated. Values are not in dispute. Options:
   - (a) Import all 11 rows as estimated.
   - (b) Truncate to FY2020-21 to FY2025-26 and import as government.
   - Also decide whether to keep the ONS-published FY2024-25 value on mid-2022 (recommended, with a note) or restate it.
2. **homelessness_count, the main researcher/verifier disagreement.** The researcher says unavailable. The verifier proposes seven modelled Shelter rows (2018, 2019, 2021 to 2025).
   - Prior founder rulings favoured keeping the gap for this exact metric.
   - Known problems in the Shelter rows: the 2023 rough-sleeping component is 2 where MHCLG shows 8 (total 241 vs 247), the 2019 split looks anomalous, the reference date changes, and there is no 2020 row.
   - No second party has verified the Shelter rows.
   - Adopting them would also need a GM build by summing the ten borough rows.
3. **emergency_response_minutes on the GM side.** Durham can go in as is. Decide whether to re-source or supplement GM with FIRE1001 (7.22) and whether to downgrade GM's 7.35 from government to estimated. Optionally, choose between primary fires and dwelling fires as the Durham headline.
4. **transit_ridership and transit_reliability.** Decide whether to re-source GM from BUS01e and BUS09a for like-for-like comparison, or to add a mode or series flag to both jurisdictions. Either way, existing GM data changes.
5. **clearance_rate.** Keep the all-crime rate, which matches GM, or switch both jurisdictions to the violence-against-the-person rate. The VAP rate fits Mandate's definition better (Durham FY2015-16 40.62%, GM 30.78%). Do not switch Durham alone. Also decide whether to import the provisional Durham FY2025-26 row and add GM's 14.93.
6. **public_transport_expansion_miles.** Choose between zeros inferred from absence (status estimated) and unavailable. Also correct the note: Horden station was council co-funded, so "no rail role" overstates it.
7. **average_commute_minutes.** Import the two noisy single-quarter LFS points (the 2015 value of 28.99 is an outlier), or mark unavailable. If importing, fix the caveat:
   - The 19.6 to 31.0 range comes from ad hoc 007252 (OD2016), not 010202.
   - State that OD2017 and OD2018 district-level means exist and were deliberately not combined.
8. **active_transportation_mode_share.** Confirm the headline. The current headline includes home workers (7.79 for 2021). Excluding them gives 10.24.
9. **capital_budget_execution_rate.** These are note fixes only:
   - Soften the FY2021-22 and FY2022-23 "post-Q3 MOWG revisions included" wording, because the reports themselves are ambiguous about timing.
   - Add that the "62% higher" narrative claim rests on the mistyped 233 figure.
   - Schedule the FY2025-26 manual pull.

Text-only corrections to apply before import (no value changes):
- transit_reliability: the gloss for [z] should be "not applicable".
- vacancy_rate caveat: the Table 615 figures are October 2025 (8,953 / 4,182 / 709). October 2024 is 9,023 / 4,090 / 748. The 69,000 PRS figure is a back-calculation, not a published number.
- planning_approval_days: remove the claim that the MHCLG release says Scotland and NI publish average weeks.
- agency_vacancy_rate: attribute the 9.71 sickness days and 6.97% turnover to the 2021 Workforce Strategy (s135625).
- Optional follow-up for major_infrastructure_delivery_rate: check whether the Major Programmes Board publishes a recurring RAG summary.

CLAIMED REAL BUT NOT RE-DERIVED

None. Every real-status value was fully re-derived with 0 mismatches:
- transit_ridership (10 rows)
- transit_reliability (9 rows)
- average_commute_minutes (2 rows)
- active_transportation_mode_share (2 rows)
- the six ONS-published crime rows for each crime metric

Partial gaps:
- Several force-area comparator figures in the researcher's crime notes were not checked:
  - Violent: FY2020-21 to FY2023-24 (3888, 3897, 4088, 3930).
  - Property: FY2016-17 to FY2023-24 (4070, 4708, 4504, 4347, 3222, 3552, 3935, 4345).

  They sit in notes only. The verifier's corrected_rows notes leave most of these out (all of them for property), so import from corrected_rows, not the researcher's original rows.
- vacancy_rate shows "rows_mismatched 3". These are mislabelled years in the caveat text, not imported rows.
- The homelessness Shelter rows are the verifier's own finding and have not been adversarially checked.
- Reference pages that could not be reopened (the ukauthority.com page returned 403, and the REG Major Programmes slide was not retrievable) affect unavailable metrics only.

OVERALL READINESS

Ready to import as is (after the text-only fixes above):
- clearance_rate (FY2015-16 to FY2024-25, plus FY2025-26 if decision 5 allows)
- emergency_response_minutes (Durham rows; the GM issue is separate)
- capital_budget_execution_rate (FY2015-16 to FY2024-25)
- transit_ridership
- transit_reliability
- active_transportation_mode_share
- 9 metrics marked unavailable: bike_infrastructure_miles, agency_vacancy_rate, digital_government_adoption, major_infrastructure_delivery_rate, permit_approval_days, planning_efficiency_index, procurement_timeline_days, vacancy_rate, planning_approval_days

Ready once one founder decision is made:
- violent_crime_rate and property_crime_rate: status choice; use the verifier's corrected_rows
- public_transport_expansion_miles: zeros or unavailable
- average_commute_minutes: import the 2 points or not

Not ready:
- homelessness_count: an unresolved disagreement, unverified Shelter rows, a known component error, and confidence values the importer may not accept. Keep the placeholder unless the founder adopts the Shelter series and the GM build.

Cross-jurisdiction follow-ups, not blocking the Durham import: re-source GM transit_ridership, transit_reliability and emergency_response_minutes, and review GM's 7.35 "government" status.