# First Week for a New Mandate Researcher

A practical five-day path from zero context to a first real contribution live on Mandate. Uses Chicago
as the training environment throughout, since it's the only jurisdiction with completed, real case
studies to learn from. Budget roughly half a day of focused time per day — this is not meant to be a
full-time crash course.

## Day 1 — Understand Mandate

- Read `docs/RESEARCHER_HANDBOOK.md` in full (§1-§3 especially — what Mandate measures, and why that's
  different from measuring popularity).
- Browse the live site: `/dashboard`, `/places/chicago`, `/governance-models`, `/data-catalog`.
- Open Chicago's two completed pipeline case studies end-to-end: `/places/chicago/pipeline/affordable-housing-institution`
  and `/places/chicago/pipeline/transit-expansion-program`. Read every timeline entry and every evidence
  record. Don't skim — these are the two worked examples everything else in this onboarding refers back
  to.
- Read `/methodology/pipeline` (the public methodology page).

**End of day 1 checkpoint:** you should be able to explain, in your own words, why Chicago Transit scored
3 and not 4, despite one of its projects (RPM Phase One) being independently impressive.

## Day 2 — Learn source standards

- Read `docs/RESEARCH_SOP.md` §4-§7 (the Tier 1/2/3 source hierarchy) closely — this is the part new
  researchers most often get wrong.
- Open the Source Registry via `/data-catalog` and look at how Chicago's real sources are named (e.g.
  "Chicago Transit Authority," "U.S. Federal Transit Administration") — notice there are no vague labels
  like "government website" or "local news" anywhere in real citations.
- Read `docs/RESEARCHER_HANDBOOK.md` §16 (data quality) twice. The distinction between "the source is
  government-tier" and "the conclusion is Government-quality" is the single most common point of
  confusion — make sure it's genuinely clear before Day 3.

**End of day 2 checkpoint:** given a hypothetical claim and a source, you should be able to say which
tier the source is and whether the resulting data quality would be Government/Academic/Alternative vs.
Estimated vs. Unavailable — and explain why those aren't the same axis.

## Day 3 — Complete a small research task

- Go to `/admin/research-queue`, and pick the lowest-effort available task (currently `median_wages` or
  `unemployment_rate` — both are "Easy" per `docs/CHICAGO_RESEARCH_ROADMAP.md`). Assign it to yourself
  and set it to `in_progress`.
- Work through `docs/RESEARCH_SOP.md` steps 2-9 for this task: find the source (BLS LAUS or Census ACS),
  extract the values, and determine the right data quality label.
- This day is intentionally scoped to *finding and evaluating* a source, not yet submitting real data —
  if you finish early, read ahead into Day 4.

**End of day 3 checkpoint:** you have a specific dataset, a specific URL, and a specific data-quality
label decided, with your reasoning written down in a scratch note (doesn't need to be submitted yet).

## Day 4 — Complete a metric with evidence

- Finish the task from Day 3: get the real values into the right format and submit them via the Admin
  Import Panel (`/admin/imports`) — preview first, check the validation report, then commit.
- Verify it live: reload the Chicago Housing/Workforce category page and confirm your data displays with
  the correct data-quality badge.
- Update the task's status in the Research Queue to `awaiting_review`, with a one-line note on what you
  found.

**End of day 4 checkpoint:** a real number, correctly sourced and labeled, is live on Mandate — the first
tangible output of the week.

## Day 5 — Complete an Institutional Pipeline assessment

- Pick a `pipeline_assessment` task from the queue (if none are unclaimed, pair with someone already
  working one, or do a practice run using a *hypothetical* Chicago policy area to avoid touching real
  data prematurely — ask before submitting a real pipeline assessment as your very first one).
- Walk through `docs/RESEARCH_SOP.md` steps 1-13 in full for this task, referring back to
  `docs/RESEARCHER_HANDBOOK.md` §3-§9 for the stage/evidence reasoning.
- Submit via `/admin/pipeline`. Notice the form will refuse to save a stage above 0 with zero evidence
  attached — that's intentional, not a bug.
- Set the task to `awaiting_review` and, on `/admin/research-queue`, set its Reviewer to a second
  researcher if one is available (or the founder if not) — see `docs/DECISION_OWNERSHIP.md` for who
  reviews what. If no `User` roster entry exists yet for you or your reviewer, add one at `/admin/users`
  first (see `docs/MANDATE_OPERATING_SYSTEM.md`, "User model") — it takes a minute and makes review
  routing and future attribution real instead of a free-text guess.

**End of week checkpoint:** you've produced one real metric contribution and one draft pipeline
assessment — both visible in Mandate, both traceable to sources you found and evaluated yourself. From
here, continue directly from the Research Queue at `/admin/research-queue` — no further onboarding is
needed for subsequent tasks.

## If you get stuck

Re-read the relevant section of `docs/RESEARCHER_HANDBOOK.md` first — most "what do I do here" questions
are answered there. If it's a genuinely new situation the handbook doesn't cover, that's useful
information: note it, and it becomes a candidate addition to the handbook rather than founder-only tribal
knowledge.
