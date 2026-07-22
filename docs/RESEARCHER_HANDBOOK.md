# The Mandate Researcher Handbook

Welcome. This document is meant to get a new researcher — a motivated undergraduate at DePaul,
Illinois State, or a similar school, with no prior context on Mandate — to the point of contributing a
real, defensible piece of research without a live training session. Read it once fully before your
first task; after that, use it as a reference.

If you only read one other document after this, read `docs/RESEARCH_SOP.md` — it's the step-by-step
checklist version of everything explained here.

## 1. What Mandate is trying to measure

Mandate exists to answer one question, rigorously, city by city: **when a political movement takes
power in municipal government, does it actually build durable institutions and produce measurable
results — or does it stop at promises and press releases?**

This is deliberately a narrower and harder question than "is this a good policy" or "is this
politician popular." Mandate does not measure popularity, ideology, or intent. It measures **delivery**.

## 2. Political popularity vs. institutional delivery — the single most important distinction

These are different questions, and conflating them is the most common mistake a new researcher makes:

- **Popularity/political question:** Did voters like this? Was it a good campaign promise? Is the
  underlying policy idea sound? Does this politician get good press?
- **Institutional delivery question (Mandate's question):** Was a durable institution, program, or
  legal mechanism actually built? Is it operating? Is there evidence it's producing outputs — and
  ideally, improving outputs over time?

A policy can be popular and score a 0 (nothing was ever built). A policy can be unpopular or
politically controversial and score a 4 or 5 (a real institution exists and is producing results).
**Your job is never to judge whether the policy was a good idea.** Your job is to determine, from
evidence, how far the institutional machinery actually got.

Concretely: if you notice yourself writing a sentence that sounds like an editorial ("this was a smart
move" / "this program never should have passed"), delete it. Write what happened, not whether it should
have.

## 3. What the Institutional Pipeline Index is

For a given (jurisdiction, policy area) pair — e.g. "Chicago, Transit Network Expansion" — Mandate
assigns a score from 0 to 5, called the **pipeline stage**, describing how far the institutional
machinery behind that policy area has actually developed:

| Stage | Label | Diagnostic question |
|---|---|---|
| 0 | Campaign Promise | Did they promise something? |
| 1 | Policy / Legislative Proposal | Has a formal proposal been introduced? |
| 2 | Legislation Enacted / Formally Adopted | Did they legally establish it? |
| 3 | Institution or Program Created | Did they build an institution? |
| 4 | Operating with Observable Outputs | Is it operating? |
| 5 | Measurable Outputs Demonstrating Improvement | Is there evidence it's producing results? |

The full criteria for each stage — what specifically counts as evidence to justify it — are defined in
`shared/src/types/pipeline.ts::PIPELINE_STAGE_DEFINITIONS` and rendered live on `/methodology/pipeline`.
Read that page; it's short and it's the same definitions your assessment will be checked against.

A jurisdiction accumulates a **history** of these assessments over time — Chicago's Transit case has 9
dated milestones from 2018 to 2026, each with its own stage, not one static number. You are usually
adding one new point to a growing timeline, not replacing what's there.

## 4. Institution vs. program vs. policy — how to tell them apart

These three words get used loosely in the real world; Mandate needs you to be precise.

- **A policy** is a stated intention or a legal rule — "the city will expand affordable housing," "rents
  above X% increase require review." A policy alone is Stage 0-2 territory.
- **A program** is a specific, bounded initiative carrying out a policy — a particular grant round, a
  particular construction project, a particular pilot. A program can be evidence of Stage 3+ *if* it's
  backed by a durable mechanism (see below) — but a single program's success is not, by itself, proof
  that the pipeline as a whole has matured (see §7).
- **An institution** is the durable mechanism — an agency, office, statutory authority, dedicated fund,
  or formally chartered program — capable of planning, funding, and executing this kind of work on an
  ongoing basis, independent of any one project. The test: **if this specific project were cancelled
  tomorrow, would the mechanism that produced it still exist and be capable of producing the next one?**
  If yes, you're looking at an institution. If no — if the "institution" is really just that one
  project's ad hoc management — you're looking at a program, not an institution.

Chicago's Department of Housing is an institution. A single year's affordable-housing grant round is a
program it runs. The distinction matters because Stage 3 requires the institution, not just a
successful program.

## 5. How to identify the relevant institution behind a policy

Start from the policy area's plain description (shown on the Admin Pipeline form) and ask: **who has
actual statutory or organizational responsibility for this, today?** Concretely:

1. Search `[jurisdiction] + [policy area topic] + department OR agency OR office` and look for a city
   government page, not a news article, first.
2. Check whether responsibility is split across multiple agencies or levels of government (city,
   regional authority, state, federal funder). If so, name all of them — don't force a single owner
   where none exists (see §11 on fragmented authority).
3. Confirm the institution has some combination of: statutory authority, dedicated staff, a budget line,
   or a founding ordinance/charter. A press release naming an "initiative" without any of these is not
   yet an institution — it may still be Stage 1-2.

## 6. How to determine an institution's pipeline stage

Work through the stage table in §3 **in order**, starting from 0, and stop at the highest stage you have
real evidence for:

1. Is there a documented promise or proposal? → at least Stage 0-1.
2. Was something formally enacted (a signed ordinance, passed legislation)? → at least Stage 2.
3. Was an agency/office/fund/program actually created to carry it out? → at least Stage 3.
4. Is that institution currently, routinely producing outputs (units built, cases handled, riders
   carried)? → at least Stage 4.
5. Is there a **quantified, multi-period, improving trend** in those outputs, from a credible source?
   → Stage 5.

Each step requires new evidence — you cannot infer Stage 3 just because Stage 2 evidence looks
impressive, and you cannot infer Stage 5 from one good year at Stage 4. See §12 for the "evidence
required per stage" table.

## 7. From evidence to a conservative assessment — the pipeline, not a project

**The single rule most likely to save you from an inflated score:** a jurisdiction does not receive a
Stage 4 or 5 score merely because *one* flagship project is operating or successful. The score reflects
the pipeline **as a whole**.

Chicago's Transit Network Expansion case is the worked example: by 2026, one project (Red & Purple
Modernization Phase One) had reached substantial completion — independently, that would look like a
Stage 4-5 output. But the flagship new-mileage project (the Red Line Extension) was still under
construction, the regional funding reform (NITA) wasn't yet operational, and most of the city's other
planned bus corridors were unfunded. The composite score stayed at **3**, because the *pipeline* — not
its best individual output — had not yet demonstrated sustained, system-wide delivery. If you're torn
between two stages because one project looks much further along than the rest of the pipeline, that
tension is itself worth writing directly into your neutral summary, the way the Transit assessment does.

When genuinely torn between two adjacent stages, prefer the lower one and say why in Limitations. See
the decision hierarchy in §16.

## 8. How to handle conflicting evidence

Real research produces contradictions: the city says a program is working, an independent evaluation
says it isn't; two agencies report different numbers for the same thing.

- **Do not average or split the difference.** Present both, cited, in your evidence and neutral
  summary, and let the tension itself inform your Limitations section.
- **Weight by source tier, not by which claim you find more persuasive.** A Tier 1 government dataset
  and a Tier 2 academic evaluation disagreeing is a real, reportable finding — not a problem to resolve
  by picking a side.
- If the conflict is severe enough that you can't respons­ibly assign a stage with confidence, that is
  itself a legitimate outcome: say so in Limitations, and lean toward the more conservative stage.

## 9. How to handle missing evidence

Search in good faith across all three source tiers (see §13) before concluding evidence doesn't exist.
Once you have:

- checked the responsible agency's own site and public records,
- checked for an academic or research-institute evaluation, and
- checked for credible reporting from a named, specific outlet,

...and found nothing, **stop searching and mark it "Unavailable."** This is not a failure — it's an
honest, correct outcome, and Mandate explicitly prefers "Unavailable" over a fabricated or optimistically
guessed number or stage. See `docs/RESEARCH_SOP.md` §15 for exactly when to stop.

## 10. How to avoid political bias

- Never write in your neutral summary or evidence notes whether you personally think the policy was a
  good idea. If you catch yourself writing "unfortunately" or "impressively," rewrite the sentence to
  state the fact without the adjective.
- Apply the *exact same* evidentiary standard regardless of which political movement or party is
  involved. If a claim from a right-leaning administration would need independent verification before
  you accepted it, hold a left-leaning administration's claim (or vice versa) to the identical standard.
- A program failing to reach a higher stage is not a criticism of the movement behind it — it is a
  factual finding about institutional maturity. Write it exactly as neutrally as you would write a
  success.

## 11. How to avoid inferring success from announcements alone

A press release, a signed bill, or a mayor's speech is evidence of, at most, Stage 1-2 (a proposal or an
enactment) — **never**, by itself, evidence of Stage 3+. To move past Stage 2 you need evidence the
institution actually exists and is staffed/funded/operating: an agency org chart, a budget appropriation,
a program's own operational reporting, or a documented output. If the only evidence you have is the
announcement itself, the correct stage is capped at 2, no matter how confident the announcement sounds.

## 12. Implementation vs. outcomes

- **Implementation** = the mechanism exists and is running (Stage 3-4): an agency was created, a program
  launched, permits are being issued, riders are boarding.
- **Outcomes** = the mechanism is *working* — producing a measurable, improving result over time
  (Stage 5): homelessness is falling, permit times are shortening, ridership is climbing.

A program can implement flawlessly and still not show improving outcomes (e.g. output numbers that
fluctuate rather than trend). That caps the score at 4, not 5 — see Chicago's Affordable Housing case,
which stayed at 4 specifically because year-to-year production numbers fluctuated rather than showed a
clean improving trend, despite the institution clearly operating and producing real output.

## 13. Temporary programs vs. durable institutions

Ask: is there a **sunset date, a one-time appropriation, or an explicitly pilot/temporary status**? If a
program is explicitly time-limited or contingent on one-time funding with no institutionalized renewal
mechanism, treat it cautiously — it may be real Stage 3-4 evidence for *that period*, but say so
explicitly in Limitations, since "durable" is part of what higher stages are supposed to mean. A pilot
that has already been renewed, expanded, or given permanent statutory footing (as Chicago's CARE program
was, expanding citywide from its original pilot) is stronger evidence of durability than a pilot still in
its original, unrenewed form.

## 14. How to cite sources

Every evidence record needs, at minimum: a specific title (not "city website"), the publishing
organization, a URL, and — where available — a publication date. Use the Source Registry (ask an
engineer to add a new one if the source you need isn't there yet — see `CONTRIBUTING.md`) rather than
typing a source name freehand, so attribution stays consistent across the whole dataset. Never cite a
source more prestigiously than it is: a local news article is a Tier 3 citation no matter how well-known
the outlet is, and should never be labeled as if it were a government or academic source.

## 15. How to record limitations

Every assessment should state, plainly, what it does *not* establish: fragmented governance you didn't
fully map, funding that's secured on paper but not yet disbursed, litigation or political risk that could
reverse progress, a related program you didn't have time to research, data you searched for and
genuinely couldn't find. Chicago's Transit limitations list (fragmented governance across six agencies,
a paused-then-restored federal funding freeze, no clean ridership trend attributable to expansion
specifically) is the model to follow — specific and honest, not a generic disclaimer.

## 16. How to assign data quality

This is a genuinely separate question from source quality, and the single most common place a new
researcher gets confused:

| Level | Means |
|---|---|
| **Government** | The evidence is an official government publication, AND the conclusion follows directly from it without you having to interpret or combine sources. |
| **Academic** | Peer-reviewed research or a university/research-institute publication, used the same way. |
| **Alternative** | A named, credible non-government/non-academic source, used only when no government or academic source exists. |
| **Estimated** | *You* had to synthesize or interpret across multiple sources to reach the conclusion — even if every individual source is Tier 1 government material. This is the label for "the sources are excellent but I had to do real analytical work to get from them to a stage/number." |
| **Unavailable** | You searched in good faith and found nothing credible. An honest gap, not a guess. |
| **Placeholder** | Synthetic demonstration data — you should never produce this; it's only ever machine-generated. |

The trap: **do not label a synthesized conclusion "Government" just because your sources were all
government documents.** Both of Mandate's real pipeline case studies (Housing and Transit) are labeled
"Estimated" precisely because reaching the final stage required the researcher's own synthesis across
several sources — not because the sources were weak.

## 17. Decision hierarchy when you're genuinely unsure

In order — resolve ambiguity by working down this list:

1. Preserve existing real data and historical research over convenience.
2. Prefer a reversible judgment call (documented uncertainty) over an irreversible one.
3. Prefer a government source over academic, academic over alternative.
4. Name alternative sources explicitly — never a vague label.
5. Prefer a conservative (lower) stage over an optimistic one.
6. Prefer "Unavailable" over a fabricated or extrapolated estimate.
7. Prefer "Placeholder"-adjacent honesty over any appearance of false completeness.
8. Document the uncertainty in Limitations rather than silently picking a side.

See `docs/PIPELINE_METHODOLOGY.md` for the full internal specification this handbook summarizes, and
`docs/RESEARCH_SOP.md` for the step-by-step procedure that puts all of this into practice.
