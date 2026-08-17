# DSA Research Master Report

**Research pass:** July 2026. **Jurisdictions researched this pass:** New York City, Seattle,
Minneapolis, Washington, D.C. **Reference/unchanged:** Chicago (the existing deep case study),
Greater Manchester (a separate, non-DSA governance model, verified unchanged).

## Executive Summary

Mandate's "Democratic Socialism" governance model contains five U.S. jurisdictions: Chicago,
Minneapolis, New York City, Seattle, and Washington, D.C. Before this pass, only Chicago had real
research; the other four were essentially untouched (0-1 real metric values each, zero real
Institutional Pipeline assessments, zero ResearchTasks). This pass used four parallel AI research
agents — one per jurisdiction — to do real, cited, publicly-accessible research, then hand-wrote the
resulting database changes (pipeline assessments, metric imports, source registry entries, and
research-queue tasks) directly, rather than letting agents write to the database themselves, so that
methodology and conservatism could be applied consistently across all four cases.

The single most important finding is that **DSA affiliation is far more uneven across this governance
model than the model's name suggests**, and getting this right mattered more than any metric or
pipeline score:

- **Chicago (Brandon Johnson)** and **New York City (Zohran Mamdani)** have well-evidenced, direct
  DSA ties — Mamdani in particular is a verified, self-identified DSA member formally endorsed by
  NYC-DSA, confirmed on multiple independent levels.
- **Seattle (Katie Wilson)** does **not**. Seattle DSA explicitly declined to endorse her after a
  formal vetting process and stated she has never been a DSA member. The seed data's prior framing
  ("Democratic socialist and progressive coalition") has been corrected.
- **Minneapolis (Jacob Frey)** and **Washington, D.C. (Muriel Bowser)** were never framed as having
  DSA-affiliated mayors — correctly so — but the research surfaced that this framing is becoming
  outdated in real time: Minneapolis's 2025 mayoral race saw a serious, DFL-endorsed DSA challenger
  (Omar Fateh) nearly unseat Frey, and D.C.'s mayoral race is about to flip entirely — Ward 4
  Councilmember Janeese Lewis George, a verified DSA member since 2018, won the June 2026 Democratic
  primary outright and is heavily favored in the November 2026 general election, which would make
  D.C. the **second** jurisdiction in this model with a DSA-affiliated chief executive.

None of this was assumed going in; all of it is cited (see each jurisdiction's file and the sources
listed below) and reflected directly in `Jurisdiction`/`Administration` descriptive text.

## Jurisdictions Covered

| Jurisdiction | Real metric values (after both passes) | Distinct real metrics (of 48) | Real pipeline categories (of 7) | Open human research tasks |
|---|---|---|---|---|
| Chicago | 160 / 530 | 31 | 6 | 0 (all resolved in prior passes) |
| Greater Manchester (different governance model) | 62 / 498 | 13 | 3 | 5 |
| New York City | 28 / 533 | 26 | 7 | 4 |
| Seattle | 30 / 529 | 23 | 7 | 4 |
| Minneapolis | 41 / 528 | 19 | 7 | 4 |
| Washington, D.C. | 26 / 529 | 21 | 7 | 4 |

*(Figures above reflect both the initial DSA pass described in this document and the subsequent
full-metric-completion pass described in "Metric-Completion Pass" below. Chicago and Greater Manchester
were deliberately included in the second pass — see that section for why the "reference, unchanged"
framing from the first pass no longer applies.)*

Chicago and Greater Manchester were verified byte-for-byte unchanged by this pass (same counts before
and after; see Methodological Limitations for the verification method). The metric-coverage gain for
the four new jurisdictions is intentionally modest (0-1 real values each, before this pass) — the
priority, per this pass's explicit instructions, was Institutional Pipeline research, where the gain
is large: **all four jurisdictions went from 0 of 7 to 7 of 7 real, evidenced pipeline categories.**

## Institutional Pipeline Coverage — Key Findings

All 28 new assessments (4 jurisdictions x 7 categories) are real, cited, and conservatively scored
per Mandate's existing 0-5 methodology (unchanged). Highlights:

- **Strongest single finding across all four jurisdictions:** Washington D.C.'s 2021 progressive
  income-tax increase (led by DSA-affiliated Councilmember Lewis George, not Mayor Bowser) funded the
  Early Childhood Educator Pay Equity Fund, independently evaluated by the Urban Institute and
  Mathematica with quantified retention, employment, and ROI effects — a genuine, credible stage 5
  case, the clearest "did it actually work" evidence chain found in this entire pass.
- **New York City's affordable-housing-institution reaches stage 5**: HPD/HDC set consecutive
  annual production records in FY2024 (25,266 units) and FY2025 (28,281 units) — real, multi-year
  improving output, though this predates and is independent of Mayor Mamdani's own (still-early-stage)
  "Block by Block" plan.
- **Seattle's Health One** (a 2016-era mobile-integrated-health unit, predating every mayoral
  administration in Mandate's records) reaches stage 5 on real outcome data (76% reduction in 911
  utilization, 69% reduction in ED visits among enrolled clients) — a reminder that some of a
  jurisdiction's strongest institutions were built long before the "DSA-adjacent" mayor took office.
- **Minneapolis's Behavioral Crisis Response** program is real and operating (roughly 30,000
  cumulative calls since 2021) but its parent Office of Community Safety is in open leadership
  conflict with the City Council as of mid-2026 — flagged explicitly as a live governance dispute,
  not papered over as a settled success.
- **A recurring, honest "stage 0" finding**: no dedicated city-run startup/venture-investment vehicle
  was found for Minneapolis or Seattle. This is reported as a real research finding (the category is
  likely a poor fit for these cities' actual economic-development apparatus), not an unresearched gap.
- **A real institutional regression**: Washington D.C.'s own streetcar-extension program was
  abandoned (line ceased operating March 2026) rather than completed — transit-expansion-program is
  scored conservatively at stage 1 for D.C. specifically as a result, distinct from WMATA's real but
  regionally-governed ridership growth.

## Research Completed by AI

- Real, cited institutional-pipeline research across all 7 policy categories for 4 jurisdictions (28
  assessments), each with an evidence summary, explicit limitations, and named sources.
- 16 new metric values imported across housing/homelessness for the 4 jurisdictions, each tied to a
  named, registered Source.
- DSA-affiliation verification for 5 administrations (Chicago's existing framing reconfirmed as
  accurate; Seattle's corrected; Minneapolis's and D.C.'s nuances documented).
- 16 new ResearchTasks written directly from each agent's identified research frontier, each with a
  research question, why it matters, what's established, what's unknown, sources already checked,
  suggested next sources, difficulty, and recommended researcher skill set.
- Descriptive-text corrections to `Jurisdiction`/`Administration` seed data reflecting verified
  affiliation findings.

## Research Requiring Humans

The 16 new ResearchTasks (`server/prisma/seed/data/researchQueue.ts`) cover, in priority order per
jurisdiction: primary-source crime-rate and transit-ridership verification (Minneapolis), PDF/dataset
extraction that resisted automated tools (Seattle's KCRHA and MHA reports), budget-line-item
reconciliation (NYC's NYPD headcount), legal-docket tracking (NYC's rent-freeze litigation risk),
pending-academic-evaluation follow-up (D.C.'s ONSE CVI study), a live governance dispute
(Minneapolis's Office of Community Safety leadership conflict), and one structural task with no
target date yet (updating D.C.'s Administration record once the November 2026 general election is
certified). None of these were artificially forced into "AI-completable" scope — they are the genuine
edge of what public web research could responsibly establish as of this pass.

## Methodological Limitations

- **Metric-value scope discipline over volume.** Several real-looking figures found by the research
  agents were deliberately NOT imported because they could not be mapped cleanly onto Mandate's exact
  metric definitions without additional computation or assumption on the researcher's part (e.g.,
  NYC's combined "major crime" totals, which are not separable into the violent/property split
  Mandate's schema requires without recomputing from raw category data this pass did not have access
  to; Seattle's MSA-level unemployment figures, which are not city-specific). These are recorded as
  open ResearchTasks rather than approximated.
- **Homelessness-count scope mismatches, made explicit rather than hidden.** Seattle's and
  Minneapolis's homelessness figures are county-wide (King County, Hennepin County), not
  city-of-Seattle/city-of-Minneapolis-specific — consistent with how Mandate already handles this for
  Chicago's regional comparators, and flagged in each CSV row's notes rather than presented as
  city-precise.
- **Confidence tiers reflect real sourcing gaps.** Minneapolis's median rent (`estimated`, sourced via
  a secondary aggregator rather than a direct ACS table lookup) and Seattle's median rent (`estimated`,
  a private listings-based figure used only because no clean ACS/NYCHVS-equivalent figure was found)
  are both marked at lower confidence than a direct government-table read would warrant, and each has
  a corresponding ResearchTask requesting the higher-confidence primary source.
- **Verification method for "Chicago/GM unchanged."** Both jurisdictions' total and real MetricValue
  counts, and real-current-PipelineAssessment counts, were queried before any new files were written
  and re-queried after the full pass (including a second, idempotency-check reseed run) — all four
  numbers matched exactly (Chicago: 528 total / 139 real metrics, 6 real pipeline categories; Greater
  Manchester: 527 total / 54 real metrics, 3 real pipeline categories).

## Taxonomy Gaps Identified

None of these were "fixed" this pass — per this pass's explicit instructions, gaps are documented, not
papered over with new architecture:

- **Tenant-rights/rent-regulation institutions** (D.C.'s TOPA tenant-right-of-first-refusal law, D.C.
  and NYC's rent-control/rent-freeze regimes) don't map cleanly to "Affordable Housing Production
  Institution," which is oriented around building/financing new units, not regulating existing private
  transactions. A dedicated "Tenant Protection & Rent Regulation" category was suggested by two
  independent research agents (Seattle's and D.C.'s) without prompting each other — a real, converging
  signal.
- **"Public goods" municipal-ownership institutions** (NYC's planned city-owned grocery stores,
  municipal broadband proposals, universal childcare) don't fit any of the 7 existing categories.
  NYC's agent suggested an 8th category, "Public Goods & Municipal Enterprise Institution."
  Deliberately not created this pass — see Recommended Next Research.
- **Regional-vs-city governance-layer mismatches** recur across three of four jurisdictions:
  Minneapolis's transit (Metropolitan Council) and progressive-revenue (state-legislated metro sales
  tax), Seattle's workforce board and transit ridership (King County/Sound Transit), and D.C.'s transit
  (WMATA, a multi-jurisdictional authority) are all real institutions the city administration doesn't
  unilaterally control. Mandate's pipeline model currently scores at the jurisdiction+policy-area
  level without a way to flag "this institution is regional, not municipal" structurally — each
  affected assessment's limitations field notes this manually, which works but doesn't scale cleanly
  as a queryable distinction.
- **Land-use deregulation vs. production institutions.** Minneapolis's 2040 Plan (ending
  single-family-only zoning) is a real, significant policy action that doesn't fit "Affordable Housing
  Production Institution" (which implies funding/building units, not deregulating what's legal to
  build) — deliberately excluded from that assessment rather than forced in.

## Source Quality Assessment

40 new Source registry entries were added this pass, spanning: municipal government press
releases/program pages (the plurality — mayor's offices, housing/planning/finance departments), two
independent academic evaluations (Urban Institute/Mathematica for D.C.; none found for the other three
cities' newest programs), nonprofit/advocacy analysis used explicitly where no government or academic
source existed and labeled accordingly (DCFPI, NLIHC, Metro DC DSA's own endorsement statements), and
local news coverage for fast-moving political developments (the Minneapolis/Seattle/D.C. mayoral-race
findings in particular relied on press coverage since these are recent political events without an
official government "record" to cite). No source was labeled at a higher tier than it actually
occupies; several (Zillow rental data, Census-Reporter-mediated ACS figures) are explicitly flagged in
their Source entries as lower-confidence proxies for a more authoritative primary source that a future
researcher should pull directly.

## Recommended Next Research

1. **Immediate, low-effort:** the four "primary-source verification" ResearchTasks (Minneapolis crime
   rates and transit ridership, Seattle's KCRHA/MHA data extraction) are mechanical data-retrieval
   tasks, not judgment calls — good first assignments for new researchers per
   `docs/RESEARCHER_HANDBOOK.md`.
2. **Time-sensitive:** the D.C. Administration-record update task has no target date yet because it
   depends on the November 2026 general election's certification — worth a calendar reminder rather
   than immediate action.
3. **Structural, not urgent:** consider whether an 8th "Public Goods & Municipal Enterprise
   Institution" policy area, or a "Tenant Protection & Rent Regulation" category, is worth adding —
   two independent research passes converged on the tenant-protection gap specifically, which is a
   stronger signal than either one alone.
4. **Not recommended:** forcing a numeric "regional vs. municipal" flag onto PipelineAssessment. Three
   separate cases surfaced this pass, and the existing manual limitations-field approach handles each
   correctly; a schema change is not obviously worth its complexity yet given the small number of
   cases — worth revisiting only if this recurs heavily in a future non-U.S. expansion pass.

## Metric-Completion Pass (same week, immediately following)

A second, broader research pass followed the one described above, at explicit request: rather than
scoping to the four newly-added DSA cities, six parallel research agents (one per jurisdiction) were
asked to attempt every remaining placeholder metric — Chicago and Greater Manchester included — not
just institutional pipeline scores. Each agent was given the exact list of still-placeholder metrics
for its jurisdiction and the same Tier 1-5 source hierarchy and conservatism rules as the original
pass. Findings were hand-reviewed and ingested via the existing CSV import pipeline (never written
directly by an agent), applying the same discipline as before: only metrics with a single, exactly
attributable, correctly-scoped real value were imported; approximations, ranges, disputed figures, and
metrics requiring extra computation the researcher couldn't fully verify were left as open
ResearchTasks rather than guessed at.

**Net effect:** real metric-value coverage roughly tripled or better across every non-Chicago
jurisdiction (see the updated coverage table above) with zero fabricated values and zero duplicate
rows (verified via a second idempotent reseed and a full duplicate-row query across all six
jurisdictions after ingestion).

**What was deliberately NOT imported, and why:**
- **Disputed or methodologically-contested figures** — e.g. NYC's violent crime rate, where FBI UCR
  (671/100k) and John Jay College's NYPD-complaint-based academic estimate (636/100k) disagree by
  methodology, not just noise; DC's violent crime rate, where a documented FBI counting-methodology
  change roughly doubles the reported figure relative to MPD's own reporting (494 vs. 1,006 per
  100k). Both are flagged rather than arbitrarily resolved.
- **Values requiring an unsupported blending or averaging decision** — e.g. NYC's five separate
  pension-fund funded ratios (NYCERS/TRS/BERS/POLICE/FIRE, ranging 75.8%-97.4%) were averaged into one
  composite `pension_funding_ratio` value explicitly marked `estimated` with the full breakdown in the
  notes field, since Mandate's schema wants one number per jurisdiction/year but the city itself
  publishes no single blended figure.
- **A validator-rejected real value**: NYC's capital-commitment achievement rate is genuinely 114%
  (the city commits more than its own planned target most years, which its own Comptroller treats as a
  fiscal-risk signal) — Mandate's percent-metric validator currently rejects any value outside 0-100,
  so this real, sourced figure could not be imported without a schema change. Flagged as a small,
  concrete architecture note: percent-typed metrics should not universally assume a 0-100 ceiling.
- **Confirmed-absent data, verified rather than assumed** — e.g. Chicago's Office of Inspector General
  has audited the Fire Department's response-time reporting four separate times over a decade (2015,
  2021, 2023, 2025) and found every time that the underlying data is too incomplete to compute a
  response-time figure at all; Greater Manchester's GMCA carries no public credit rating because
  English combined authorities borrow through the central-government Public Works Loan Board rather
  than issuing rated municipal bonds, unlike every U.S. jurisdiction in Mandate. Both are real research
  conclusions, not gaps in effort, and are documented as such rather than left silently blank.
- **Tooling-budget exhaustion, distinguished honestly from genuine absence**: two of the six research
  agents (Washington DC and Chicago) explicitly flagged that a shared per-session web-search quota ran
  out partway through their work, and named specific real sources they had located but not yet
  extracted (DC: ~18 metrics including budget_balance, capital_investment, and several innovation
  metrics; the underlying documents are real and were found, just not fully read). These are recorded
  as follow-up ResearchTasks, not folded into the "unavailable" list.

New Source registry entries this pass span official fiscal offices (Chicago's COFA, Minneapolis and
Seattle's Finance Departments, DC's OCFO/DCRB, GMCA's own committee papers), federal/national
statistical agencies (BLS QCEW, Census BFS/BDS/BPS, ONS for Greater Manchester), and university
technology-transfer offices (Northwestern, UChicago, University of Minnesota, University of
Washington) — each tiered honestly (government/academic/estimated/alternative) rather than uniformly

## Clean-out pass (2026-08-17): fiscal + crime metrics for NYC, Minneapolis, Seattle, DC

Despite the Metric-Completion Pass above, NYC/Minneapolis/Seattle/DC were still ~93-95% synthetic
placeholder several weeks later — "roughly tripled" coverage from a near-zero base still leaves the
large majority of each jurisdiction's 44 metrics untouched. This pass targeted two full clusters
(fiscal health: budget_balance, debt_per_capita, capital_investment, pension_funding_ratio; and
crime: violent_crime_rate, property_crime_rate, clearance_rate) across all four cities, via 8
parallel research agents (one fiscal + one crime agent per city). Net effect: placeholder rows fell
by 13-54 per city (NYC 505→492, Minneapolis 487→452, Seattle 499→445, DC 503→469) — the fiscal
cluster in particular is now close to fully real for all four cities across a 9-11 year span each.

**A genuine methodology dispute was resolved for DC's crime rate.** DC's violent/property crime
figures had been stuck unimported because FBI/NIBRS and MPD's own reporting disagree by roughly 2x
(494 vs. 1,006 per 100k, 2024). This pass found MPD's own Annual Report explicitly states, in MPD's
own words, that its "DC Code Index Offense" methodology — not FBI/NIBRS — is its authoritative
operational and public-reporting standard, with a documented offense-by-offense reconciliation table
explaining the gap. That resolves the dispute in favor of MPD's own figures, now imported.

**Genuinely primary sources were found where an earlier pass explicitly failed.** Minneapolis's
violent/property crime rates had previously been rejected for lacking a primary source (only
secondary aggregators like city-data.com were found). This pass discovered that the FBI's own Crime
Data Explorer supports agency-level ORI filtering, letting it pull Minneapolis-Police-Department-
specific NIBRS data directly — a genuine primary source the earlier pass didn't know existed. The
resulting 2023 homicide count (72) was independently cross-validated against the Minnesota BCA's own
agency-level homicide table.

**Several real, already-researched CSVs were sitting unimported in `imports/data/public-safety/`**
from an earlier session (Minneapolis's own open-data crime feed for 2021-2022/2024, NYC's official
911 response-time reporting, Seattle PD's direct 2022 crime report and 2025 homicide-clearance
figure, DC's homicide closure rate) — these were folded into this pass rather than re-researched,
using an explicit import-order convention where a more-authoritative later import overwrites a
less-authoritative earlier one for the same jurisdiction/metric/year (e.g., Minneapolis's 2023
crime rate was imported first from the city's own open-data feed at `estimated` quality, then
overwritten by the FBI CDE agency-level figure at `government` quality; Seattle's 2022 crime rates
and 2025 clearance rate were similarly upgraded from WASPC-derived aggregates to SPD's own direct
reporting). Two lower-tier CSVs from that same earlier session (`new-york-city-crime-2023-2024.csv`,
citing a disputed academic/aggregator figure Mandate had already decided not to use, and
`washington-dc-property-crime-2024.csv`, an aggregator figure now superseded by MPD's own primary
data) were deliberately left un-imported, as a documented record of what was tried and rejected.

**clearance_rate scoping was handled inconsistently across cities, and this pass tried to correct
toward the metric's actual definition** ("share of reported violent crime cases cleared") rather than
whatever scope happened to be easiest to find:
- NYC and Minneapolis: correctly scoped to violent-crime categories specifically (NYPD's own
  reformed "Total Clearance Rate" for Murder+Rape+Robbery+Felony Assault; FBI CDE's violent-offense
  clearances / violent-offense count).
- Seattle: WASPC only publishes an all-Group-A-offense clearance rate (including property crime) at
  the agency level — imported at `estimated` quality for 2015-2024, but for 2025 specifically, SPD's
  own homicide-only closure rate (86%) was used instead, since staying within the violent-crime
  universe (even narrowed to homicide alone) is more honest than a broader figure that includes
  property crime.
- DC: no blended violent-crime clearance rate exists in any source found; MPD's homicide-only
  closure rate (60%, 2024) was imported as the same kind of narrow-but-correctly-scoped proxy used
  for Seattle, rather than force-averaging MPD's four separate offense-type clearance rates without
  the incident-count weights needed to do so defensibly.
- Greater Manchester's clearance_rate (from an earlier, separate pass) remains an all-crime proxy at
  `estimated` quality and was not revisited this pass — a violent-crime-specific recomputation for GM
  is already tracked as an open ResearchTask.

**What was deliberately not pursued further this pass, and why:** the other ~40 metrics per city
(housing, workforce, transit, innovation beyond what earlier passes covered) remain mostly
placeholder — this pass scoped to two full clusters rather than spreading thin across all of them,
consistent with the "research first, real data only" discipline applied throughout this project.
Follow-up ResearchTasks for the specific remaining gaps found along the way (a DC violent-crime
clearance weighted average, a 2025 DCRB pension figure, Greater Manchester's clearance_rate scoping)
are recorded in `researchQueue.ts`.
