# Institutional Pipeline Index — Internal Methodology Specification

This is the internal counterpart to the public-facing `/methodology/pipeline` page. It exists so a
researcher (or a future engineer) can resolve an ambiguous case without guessing, and so scoring stays
consistent as more jurisdictions and policy areas are added. The public page states the rules; this
document explains the reasoning behind them and works through the harder judgment calls.

## 1. What is the unit of analysis?

**A (jurisdiction, policy area) pair, at a point in time.** Not a project, not an agency, not a piece of
legislation — those are all *evidence* that feeds into the assessment of the pair. "Chicago /
Transit Network Expansion" is a unit of analysis; "the Red Line Extension" is one project that provides
evidence for it. This distinction is what allows a jurisdiction to score a 3 even while one of its
projects (RPM Phase One) is independently at what would look like a 4 or 5 in isolation.

## 2. What exactly counts as an "institutional pipeline"?

The durable mechanism(s) — agencies, offices, funds, boards, statutory authorities, or formally
chartered programs — capable of planning, funding, and executing work in that policy area on an ongoing
basis. A pipeline is not: a single grant, a single construction project, a single budget line item, or a
single year's activity. Evidence of a pipeline existing looks like: an agency with statutory authority
and staff, a dedicated funding mechanism, a documented planning process, or a track record of more than
one initiative moving through it.

## 3. How should researchers distinguish an institution from a project?

Ask: *if this specific project were cancelled tomorrow, would the mechanism that produced it still
exist and be capable of producing the next one?* If yes, you are looking at an institution (or evidence
of one) — score the pipeline accordingly. If no — if the "institution" is really just the project's own
ad hoc management structure with no separate statutory or organizational existence — you are looking at
a project, and it is evidence toward Stage 3+ only if it demonstrates that some broader mechanism (an
agency, a fund, a statute) was actually the thing that made it possible.

## 4. How should researchers handle multi-level governance?

Score the pair based on the *jurisdiction being profiled*, but do not penalize it for legitimately
sharing implementation authority with another level of government (state, regional authority, federal
funder) — fragmentation is a real feature of many U.S. policy areas (transit, workforce development)
and should be documented in Limitations, not treated as disqualifying. What matters is whether the
jurisdiction's own institutions are genuine, active participants in planning/funding/execution, not
whether they act alone. A jurisdiction that is a passive beneficiary of another government's program,
with no institutional role of its own, should generally not score above Stage 2 for that program.

## 5. How should researchers handle fragmented authority?

Same principle as multi-level governance, applied within a single jurisdiction: if a policy area is
split across several agencies (CTA/CDOT/RTA-successor for transit; CDOT/DPS for permitting), assess
whether those agencies function as a coherent pipeline (clear division of labor, complementary rather
than duplicative mandates, evidence they coordinate) or as genuinely disjointed silos. The former can
still reach higher stages; the latter should be capped lower and the fragmentation stated explicitly in
Limitations, since fragmentation itself is evidence against durable, coordinated execution capacity.

## 6. How should researchers treat individual successful projects?

**As evidence, never as the score.** A single successful, even celebrated, project raises confidence
that stage-3-level execution capacity exists (an institution *can* deliver), but it does not by itself
prove the pipeline is producing sustained, ongoing outputs (Stage 4) or measurable improving performance
(Stage 5) unless the pipeline as a whole shows a pattern of repeated delivery. See the Chicago Transit
case: RPM Phase One's completion and the Chicago Ave bus lane are both genuine Stage-4-caliber
individual outputs, but because RLE was still under construction, NITA was not yet operational, and most
of the city's other planned bus corridors were unfunded, the composite score stayed at 3. This is the
single most important rule in this document — see the public methodology page's "unit of analysis"
section, which states it directly for end users.

## 7. What qualifies as observable output?

A concrete, externally verifiable thing the institution produced through its ordinary operation: units
built, permits issued, grants disbursed, riders carried, cases resolved, corridors completed. It must be
attributable to the institution's routine functioning, not to a one-time event unrelated to its normal
operations. A single output does not imply Stage 4 for the whole pipeline (see #6) — Stage 4 requires
that the institution is *currently, routinely* producing outputs, not that it has produced one ever.

## 8. What qualifies as durable performance (Stage 5)?

Evidence — government, academic, or otherwise credible — of a *measurable, improving trend* over
multiple periods, not a single good year and not merely continued existence. A program that has run for
years without measurably improving its outcomes (or without outcome data existing at all) stays at Stage
4. Stage 5 is intentionally the hardest stage to reach; most real institutions, most of the time, belong
at 3 or 4. If in doubt between 4 and 5, choose 4 and document why in Limitations — see rule #7 in the
final-decision hierarchy ("prefer conservative scores").

## 9. What qualifies as improving performance, precisely?

A quantified metric with at least a few comparable periods showing directional improvement, cited to a
specific dataset or report — not a qualitative claim of momentum, and not extrapolation from a single
data point. If the improving trend exists for one component of a fragmented pipeline but not the whole
(e.g. one metro's ridership recovered post-pandemic while a broader regional system did not), document
the mixed picture in Limitations and score based on the pipeline as a whole, per #6.

## 10. What evidence is required to move from each stage to the next?

| Transition | Minimum required evidence |
|---|---|
| 0 → 1 | A specific proposed bill, ordinance, executive order draft, or formal published proposal — not just a speech or platform plank. |
| 1 → 2 | Confirmation the proposal was formally passed/signed/adopted through the applicable legal process (a citation to the enacted text, a legislative record, or an official signing announcement). |
| 2 → 3 | Confirmation an agency, office, fund, board, or program was actually created/staffed/funded to carry out the law — not just that the law permits one to exist. |
| 3 → 4 | At least one dated, sourced observable output produced by that institution's ongoing operation, AND an assessment that this is representative of the pipeline's current state, not an isolated event (see #6). |
| 4 → 5 | A cited, quantified, multi-period trend showing improvement, per #8–#9. |

Every transition above Stage 0 should cite at least one evidence record (a `EvidenceLink` or
`SupportingLegislation` row) — this is enforced in the Admin Pipeline form (a submission for stage > 0
with zero evidence and no legislation is blocked client-side) as of this hardening pass.

---

## Data quality vocabulary — what each label actually means

The same six-level vocabulary (`government | academic | alternative | estimated | unavailable |
placeholder`) is shared by `MetricValue.dataQuality` and `PipelineAssessment.dataQuality`, and it is
easy to conflate four genuinely different concepts. This is now specified as a structured constant,
`DATA_QUALITY_LEVELS`, in `shared/src/types/pipeline.ts` — treat that file as the source of truth; this
section explains the reasoning.

- **Source quality** (government/academic/alternative) describes *who published the underlying
  evidence*, i.e. the Tier 1/2/3 hierarchy also used for individual `EvidenceLink` records.
- **Evidence quality** is whether verifiable evidence exists for the *specific claim* being made, not
  just for the general topic. A Tier-1 government report about transit ridership generally does not, by
  itself, establish a specific institutional-maturity conclusion — that requires evidence quality
  specific to the stage claim being made.
- **Researcher synthesis** is real, necessary, and should be labeled **"estimated,"** even when the
  underlying evidence is Tier 1 government material. Reaching "Chicago Transit is Stage 3" required
  synthesizing across eight separate government and news sources spanning eight years — no single
  document says "Chicago transit expansion is at stage 3." That synthesis step is exactly what
  "estimated" is for. Do not confuse "the sources are government-tier" with "the conclusion is a
  government-tier finding" — those are different claims, and the latter should be reserved for cases
  where a single authoritative publication states the conclusion directly (rare for pipeline
  assessments; common for raw metrics like Census population counts).
- **Absence of data** is "unavailable" — an honest, explicit statement that a genuine search turned up
  no credible evidence, never inferred silently by leaving a field blank.
- **Placeholder** always means synthetic demonstration data with zero real-world basis. It should never
  be mixed up with "estimated" (which has real evidence behind it, just requiring synthesis) or
  "unavailable" (which is an honest absence, not a fake number).

## Stage definitions (current, canonical)

The six stages (0–5) are defined in `shared/src/types/pipeline.ts::PIPELINE_STAGE_DEFINITIONS`, each with
a `question` and `criteria` field — that array is the single source of truth consumed by both the public
methodology page and the admin researcher form (rendered live next to the stage selector). Do not
duplicate the stage labels or criteria anywhere else in the codebase.
