# Durham County Council Case Study

**Purpose of this document.** Chicago and Greater Manchester proved Mandate's methodology could
generalize across country and government type while staying inside a left-of-center governing
tradition. `docs/REFORM_UK_PILOT_STUDY.md` ran a deliberate stress test in the opposite political
direction — a Reform UK-governed English local authority — and concluded, research-only, that Durham
County Council was the right unit of analysis (not Clacton-on-Sea) and that a conservative pipeline
score of Stage 0-3 across most initiatives was the methodologically honest outcome. This document
records what happened when that recommendation was actually implemented: Durham added as a jurisdiction,
a first batch of real metrics imported, and a specific, evidence-grounded reason recorded for why no
Institutional Pipeline assessment has been created yet.

## Why Durham, and why nothing new here on the governance-unit question

See `docs/REFORM_UK_PILOT_STUDY.md` for the full reasoning (Clacton-on-Sea is not a body Reform
controls; Essex County Council governs a county, not Clacton; Durham is a true single-tier unitary
authority under continuous, uncontested Reform control since May 2025 with over a year of governing
record). That reasoning is unchanged and not repeated here. Durham was added to `jurisdictions.ts`
under a new `reform-uk` governance model (`server/prisma/seed/data/governanceModels.ts`), Mandate's
first right-of-center comparative grouping, alongside `democratic-socialism` and
`greater-manchester-devolution`.

## Metrics implemented this pass

Fiscal health and workforce were the two categories the pilot study's Phase 2 and Phase 4 found fit
cleanly and had solid named UK sources, so they were the first batch pulled and imported:

| Metric | Years | Source | Quality |
|---|---|---|---|
| `capital_investment` | FY2023-24, FY2024-25 | Durham CC's own audited Statement of Accounts, Note 33 | government |
| `debt_per_capita` | FY2023-24, FY2024-25 | Same accounts, external borrowing / ONS population estimate | government |
| `budget_balance` | FY2023-24, FY2024-25 | Same accounts, CIES "(Surplus)/Deficit on Provision of Services" | government |
| `pension_funding_ratio` | 2019, 2022 | Durham CC Pension Fund (LGPS) 2022 triennial valuation | government |
| `median_wages` | 2024, 2025 | ONS ASHE Table 7.7a, County Durham | government |
| `unemployment_rate` | 2022, 2023, FY2024-25 | ONS Local Labour Market Statistics + APS via Nomis | government |
| `labor_force_participation` | 2022, 2023, FY2024-25 | Same sources | government |
| `apprenticeships` | AY2019/20-2024/25 | DfE Apprenticeships (Explore Education Statistics) | government |

A methodological note worth carrying forward: `budget_balance` here uses the audited **CIES actual
outturn deficit** (£70.852m FY2023-24, £45.198m FY2024-25), not the much-larger forward-looking
Medium Term Financial Plan "budget gap" figures (£71m-£82m) that circulated in press coverage of the
2025/26-2026/27 budget cycle. Those are two genuinely different numbers — a pre-savings planning
shortfall versus an audited actual position — and conflating them would misrepresent Durham's fiscal
position in either direction. The same CIES-basis convention was applied to Greater Manchester's
`budget_balance` this same pass (see below) for cross-jurisdiction consistency.

`clearance_rate`, `violent_crime_rate`, `property_crime_rate`, `tech_employment`,
`business_survival_rate`, and the remaining metrics are still synthetic placeholders — not researched
this pass, not confirmed unavailable either. This is a deliberate first batch, not a completed sweep.

## Why there is no Institutional Pipeline assessment for Durham yet

This is the most important finding of this pass, and it goes beyond what the pilot study's Phase 2
already flagged. A follow-up research pass set out to nail down exact, citable primary-source evidence
for the three real, dated institutional events the pilot study identified (the cabinet portfolio
rename, the 2026/27 budget vote, and the climate-emergency-declaration rescission), plus to check
whether Workforce — the *one* category Phase 2 called a clean taxonomy fit — could support a
conservative pipeline score. The results argue for waiting rather than forcing a score:

- **Cabinet portfolio rename** — confirmed via primary durham.gov.uk sources: "Stronger Communities
  and Belonging" (21 May 2025) renamed to "Communities and Civic Resilience" (16 September 2025), same
  officeholder both times. This is real, but it doesn't correspond to any of Mandate's 7 policy-area
  institutions (housing, transit, workforce, permitting/procurement, alternative crisis response,
  public innovation, progressive revenue) — it's a cabinet-structure relabeling, not an institution
  being built, expanded, or legislated. This confirms, with a concrete example, Phase 2's finding that
  Durham's most Reform-characteristic actions (cultural/symbolic governance changes) have no home in
  the existing taxonomy.
- **2026/27 budget vote** — the *date* is confirmed by primary source (a 3 February 2026 durham.gov.uk
  release states the budget would go to full Council for approval on 18 February 2026), but the actual
  vote outcome/tally was not found in any source checked this pass. The specific cut figures (parking
  charges, permit fees, school-crossing-patrol reductions, ~88 FTE) come from a 19 November 2025
  Cabinet-stage report, not a confirmed final Council vote. A "budget_balance" institution doesn't
  exist in Mandate's taxonomy anyway (fiscal-health's specific institution is `progressive-revenue-
  institution`, a revenue-side concept — a spending-cuts budget is not a revenue institution any more
  than Greater Manchester's Business Rates Retention was a "progressive" one).
- **Climate emergency rescission** — the date (16 July 2025) and headline outcome ("62 in favour") are
  corroborated by two independent local outlets, but the primary council minutes (democracy.durham.gov.uk)
  could not be reached this pass, and the for/against/abstain breakdown reported across sources does not
  reconcile cleanly to Durham's 126-seat council. This is recorded as alternative-tier evidence, not yet
  primary-confirmed, and — like the cabinet rename — has no home in the existing 7-institution taxonomy
  even once fully confirmed.
- **Workforce (the one category that looked like a clean fit)** — DurhamWorks (started August 2015),
  DurhamEnable (2021), and DurhamLearn (~19+ years old) are all real, mature, operating programs, but
  every one of them **predates Reform's May 2025 takeover by years**. The only genuinely new document
  is an Apprenticeship Strategy 2025-2028, presented to Cabinet on 19 November 2025 — but it is
  explicitly a successor to a 2022-2025 strategy, i.e. a renewal of an existing program, not a new
  institution. Scoring `workforce-development-institution` here would require deciding whether
  Mandate's Institutional Pipeline tracks *jurisdiction* institutional history (in which case Durham's
  workforce institution is genuinely mature, Stage 4-5, entirely independent of who currently governs)
  or *administration-attributable* achievement (in which case there is nothing here to score yet beyond
  a routine strategy renewal). Both readings are defensible under the current schema, and Mandate has
  not yet had to make this call explicitly for any other jurisdiction, because every prior pipeline
  assessment recorded so far (Chicago, Greater Manchester) happened to involve institutions that were
  either built by the tracked movement or clearly predated it in a way nobody was tempted to credit
  (e.g. GM's "Let's Talk County Durham"-style traps were always caught before import). Durham is the
  first case where the "clean fit" category runs directly into this unresolved question.

**Decision: no PipelineAssessment rows were created for Durham this pass.** Forcing a score into any of
the 7 existing policy areas — none of which cleanly fit what Reform has actually done here — would
either misattribute a pre-existing institution to a new administration, or stretch a specific
institution-type definition (a *revenue* institution, a *crisis-response* program, a *procurement*
reform) to cover something structurally different (a cabinet reorganization, a spending-cuts budget, a
symbolic declaration reversal). This is the same conservative discipline applied to Greater Manchester's
`progressive-revenue-institution` finding, extended one step further: sometimes the honest answer is
that the taxonomy itself needs a decision before evidence can be honestly recorded, not that more
research will resolve the gap.

## Architectural question this pass surfaces, for methodology-lead sign-off

Whether Mandate's Institutional Pipeline is meant to track **jurisdiction-level institutional history**
(any real institution operating today, regardless of which administration built it, the way a Stage
score is generally understood) or **administration-attributable achievement** (credit only accrues to
the movement/administration Mandate is comparatively tracking). This has been implicitly the former in
every case so far, but Durham is the first jurisdiction where a genuinely mature, well-evidenced,
real institution (DurhamWorks) sits entirely outside the tracked administration's tenure, with no
ambiguity about which reading changes the outcome. Resolving this doesn't require new schema — the
existing multiple-dated-row structure (already used for Greater Manchester's alternative-crisis-response
timeline) supports either reading — it requires a decision about what the score is supposed to mean.
Deferred here, not implemented, pending that decision.

## Open items carried into a future pass

1. Confirm the 18 February 2026 budget vote's actual outcome/tally from a primary source.
2. Confirm the 16 July 2025 climate-vote division from `democracy.durham.gov.uk` directly (unreachable
   this pass) rather than press paraphrase.
3. Resolve the jurisdiction-history-vs-administration-attribution question above, then decide whether
   `workforce-development-institution` gets a Stage 4-5 historical assessment for Durham.
4. Pull the remaining metrics: crime rates (Durham Constabulary force area, same ONS/Home Office method
   already proven for Greater Manchester this pass), business formation/survival, tech employment.
5. Confirm the Durham CC Pension Fund's 2025 triennial valuation percentage from its primary Valuation
   Report (only a press paraphrase, "no change" from 2022, was found this pass).
