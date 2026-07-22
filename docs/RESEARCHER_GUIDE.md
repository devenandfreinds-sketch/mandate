# How to Research a Mandate Institutional Pipeline

This is the practical companion to `docs/PIPELINE_METHODOLOGY.md` (the rules) and `/methodology/pipeline`
(the public explanation). It's written for a new researcher — someone comfortable reading government
websites and primary sources, not necessarily a software engineer — picking up their first policy area.
It uses Chicago's Housing and Transit case studies to illustrate reasoning, not as templates to copy
verbatim: your policy area will have its own institutional shape.

## The steps

**1. Define the policy area.** Read its existing `description` on the Admin Pipeline form or the place
profile card. Confirm you understand what it is actually asking — "Transit Network Expansion" asks
about capacity to plan/fund/build *new* transit infrastructure, not about whether existing transit is
good or well-run. Write down, in one sentence, the question your research needs to answer.

**2. Identify the institutional owner(s).** Who has statutory or organizational responsibility for this
policy area? For Chicago Housing, that was cleanly the Department of Housing. For Transit, it was
genuinely fragmented across CTA, RTA (and its 2026 successor NITA), CMAP, CDOT, and federal FTA funding
— name every real party, don't force a single owner where none exists.

**3. Establish the baseline.** Find the earliest point where this policy area's institutional story
meaningfully begins — a campaign promise, a founding ordinance, an original enabling statute. This
becomes your first (oldest) timeline entry.

**4. Build the historical timeline.** Identify the actual dated milestones between the baseline and
today: proposals, enactments, program launches, major funded outputs, setbacks. Each becomes one
`PipelineAssessment` row via the Admin Pipeline form. You are not required to score every year — score
what actually changed. The Transit case has 9 entries across 8 years because that's how many distinct,
citable milestones existed; don't manufacture entries where nothing changed.

**5. Find Tier 1 evidence.** For each milestone, look first for a government source: the responsible
agency's own site, an official press release, a signed ordinance/bill text, a federal filing (FTA
FEIS/ROD, HUD data, Census data). This is almost always available for enactments and formal agency
actions — it's rarer for informal "the program is working well" claims.

**6. Add Tier 2 evidence where useful.** Academic evaluations (university research centers, peer-reviewed
studies) are valuable for outcome claims — did the program actually work — which government self-reporting
is often weaker on. Not every milestone needs one; add it when it materially strengthens or complicates
the picture (see Alternative Crisis Response's independent Urban Labs evaluation vs. the city's own
reporting, in the research roadmap).

**7. Use named Tier 3 sources only when necessary, and always name them precisely.** If no government or
academic source exists for a real milestone, a specific, credible outlet is acceptable — but name it
specifically ("WTTW News (Chicago PBS) Transit Coverage," not "local news"). Check the Source registry
first; if the specific outlet isn't there yet, add it rather than reusing a generic placeholder source.

**8. Assign the stage.** Use the 0–5 definitions in `PIPELINE_STAGE_DEFINITIONS` (shown live next to the
stage selector on the Admin Pipeline form). Remember the composite-scoring rule: score the pipeline as a
whole, not its single best project (see `docs/PIPELINE_METHODOLOGY.md` §6). If you're genuinely torn
between two stages, that tension itself is worth writing into the neutral summary — see how the Transit
memo explicitly weighed "ecosystem maturity" against "flagship project maturity" before settling on 3.

**9. Assign data quality.** This is not the same question as source quality — see
`docs/PIPELINE_METHODOLOGY.md`'s data-quality section. If your stage conclusion required synthesizing
across multiple sources rather than reading it off one authoritative document, that's "estimated," even
if every individual source is Tier 1 government material (this was true for both the Housing and Transit
case studies). If you searched in good faith and found nothing credible, use "unavailable" — never guess
a number or a stage to avoid an empty field.

**10. Document limitations.** State plainly what your assessment does *not* establish: fragmented
governance, funding not yet secured, litigation risk, data you didn't have time to find, a component you
deliberately left unresearched. The Transit case's limitations list — fragmented governance across six
agencies, a paused-then-court-restored federal funding freeze, no clean ridership trend attributable to
expansion specifically, Metra's South Shore project not researched this pass — is a good model for
honesty about what's still uncertain.

**11. Submit for review.** The Admin Pipeline form (`/admin/pipeline`) requires at least one evidence
record or a legislation citation for any stage above 0 — you cannot submit an unsupported score. It also
shows the existing history for the pair before you submit, so you can see what's already there. A new
submission only becomes the "current" score if its date is on or after the latest existing assessment;
an earlier-dated backfill is correctly inserted into history without disturbing the current score.

## Two worked examples (for reasoning, not copying)

- **Chicago Affordable Housing Production** — a clean single-institution case. The Department of Housing
  is the unambiguous owner; its own Annual Report supplied both the "institution operating" evidence and
  the "observable output" evidence (units produced per year). Landed at Stage 4 because outputs are
  real and ongoing but no clean improving trend across years was established (year-to-year production
  numbers fluctuate rather than climb) — so Stage 5 was deliberately not claimed.

- **Chicago Transit Network Expansion** — a fragmented, multi-agency case with a real methodological
  tension. Two individual projects (RPM Phase One, a completed bus corridor) were independently
  Stage-4-caliber, but the flagship expansion (Red Line Extension) was still under construction and the
  regional funding reform (NITA) was not yet operational. Per the composite-scoring rule, the pipeline as
  a whole was scored 3, not 4 — the write-up says so explicitly, rather than letting the best individual
  project set the score.
