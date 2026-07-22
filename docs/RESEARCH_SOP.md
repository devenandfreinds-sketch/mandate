# Mandate Research SOP

A step-by-step procedure for completing one research task, from picking it up to it appearing live on
Mandate. Read `docs/RESEARCHER_HANDBOOK.md` first for the reasoning behind these steps — this document
is the checklist version.

## 1. Select a research task

Go to `/admin/research-queue` (log in first — ask whoever set up your account for the admin password).
Pick the highest-priority `unassigned` task you're able to do, or continue one already assigned to you.
Put your name in "Assigned to" and set status to `in_progress` immediately — this is how the rest of the
team knows what's already spoken for.

## 2. Define the exact metric or policy area

Read the task's research question carefully. If it's a `metric` task, open `/metrics/:slug` to see the
metric's existing definition, unit, and any `calculationMethod`/`limitations` already on file. If it's a
`pipeline_assessment` task, open `/methodology/pipeline` and re-read the stage definitions before you
start. Write, in one sentence, exactly what question your research needs to answer — this becomes the
first line of your eventual notes.

## 3. Identify the relevant jurisdiction and administration

Confirm the jurisdiction (usually Chicago right now) and, if relevant, which mayoral administration was
in office when the events you're researching happened — check `/places/chicago` for the administration
timeline. This matters for attributing a milestone to the right administration later, if asked.

## 4. Search Tier 1 — government sources

**Search here first, always.** Tier 1 is:

- **Qualifies:** the responsible city/county/state/federal agency's own website, official datasets
  (e.g. the Chicago Data Portal), official reports, signed legislation/ordinance text, court filings,
  official press releases from a government office.
- **Does not qualify:** a news article *about* a government report (go find the report itself instead);
  a politician's campaign website or social media (that's evidence of a promise, not an institution); an
  advocacy group's summary of government data (go to the primary data).
- **When to use:** always your first search. Most enactment, funding, and institution-creation evidence
  should come from here.
- **How to label:** `sourceTier: "government"` on the evidence record. This does NOT automatically make
  your overall assessment's `dataQuality` "Government" — see step 9.

## 5. Search Tier 2 — academic sources

- **Qualifies:** peer-reviewed journal articles, university research center publications (e.g. a
  university urban labs program), reports from established academic research institutes.
- **Does not qualify:** a university's own PR/news office describing someone else's work (find the
  actual paper); a student blog or unreviewed working paper without institutional backing.
- **When to use:** best for *outcome* claims — did the program actually work — where government
  self-reporting is often weaker or less independent. Not every milestone needs a Tier 2 source; add one
  when it materially strengthens or complicates the picture.
- **How to label:** `sourceTier: "academic"`.

## 6. Search Tier 3 — alternative sources

- **Qualifies:** a **specific, named, credible outlet or organization** — a well-regarded local news
  outlet, an established nonprofit's own research, a recognized industry data provider — used only when
  no government or academic source exists for the specific claim.
- **Does not qualify:** an unnamed or vague source ("local news," "reports suggest," "a government
  website" without naming which one); social media posts; content farms or SEO-driven sites; anything
  you can't attribute to a specific, real publisher.
- **When to use:** last resort, and only when the claim genuinely needs it (e.g. a groundbreaking
  ceremony a government site didn't cover in detail). If you're reaching for Tier 3 because Tier 1/2
  searches were quick or lazy, go back and search harder first.
- **How to label:** `sourceTier: "alternative"`, and name the specific outlet precisely (e.g. "WTTW News
  (Chicago PBS)," never "local news"). If the exact source isn't already in the Source Registry, ask an
  engineer to add it — see `CONTRIBUTING.md` — rather than reusing a generic placeholder source.

**The system must never present a Tier 3 source as if it were equivalent to a government source.**
Mislabeling a source's tier is one of the few mistakes that directly damages Mandate's credibility —
when in doubt, tier it lower, not higher.

## 7. Record the source

Before extracting evidence, check whether the source already exists in the Source Registry (visible via
the source-name autocomplete on the Admin Pipeline form, or `/data-catalog`). If it doesn't, ask an
engineer to add it with a precise name, publisher, URL, and tier — don't invent a source name freehand.

## 8. Extract the evidence

For each piece of evidence, record: a specific title, a one-sentence description of what it shows, the
publication date if available, the publisher, and the URL. Quote or closely paraphrase the specific fact
you're relying on — don't just link a 40-page report and hope the reader finds the right page.

## 9. Determine the appropriate data quality

This is a judgment call, not a lookup — see `docs/RESEARCHER_HANDBOOK.md` §16 for the full reasoning.
Quick test: *did you read the conclusion directly off one authoritative document, or did you have to
combine/interpret multiple sources to get there?* The former can be "Government"/"Academic"/
"Alternative" depending on the source; the latter is "Estimated," even if every source you used was
Tier 1. If you found nothing credible after a genuine search across all three tiers, it's "Unavailable."

## 10. Determine the institutional pipeline stage, if applicable

Only for `pipeline_assessment` tasks. Work through the stage ladder in order (see Handbook §6), stop at
the highest stage with real evidence, and remember the composite-scoring rule: score the *pipeline*, not
its best individual project (Handbook §7). If genuinely torn between two stages, pick the lower one and
explain the tension in your neutral summary.

## 11. Write the assessment

Write the neutral summary in plain, non-editorializing language — state what happened, not whether it
was good policy (Handbook §2, §10). For a metric task, this is just accurate values plus notes on
methodology/coverage gaps.

## 12. Record limitations

State explicitly what your research does *not* establish — see Handbook §15 for the model to follow. An
assessment with no limitations listed is a red flag, not a sign of a clean result; almost every real case
has some.

## 13. Submit for review

Submit via `/admin/pipeline` (for pipeline assessments) or the Admin Import Panel at `/admin/imports`
(for metric data). Both forms show you the existing history for the pair/metric before you submit, so
you can see what's already there and avoid contradicting it without explanation. The pipeline form will
block submission if you haven't attached at least one evidence record or legislation citation for any
stage above 0 — this isn't a bug, it's the "unsupported score" guardrail.

Then go back to `/admin/research-queue` and set the task's status to `awaiting_review`.

## 14. Import or publish

Once reviewed (see `docs/DECISION_OWNERSHIP.md` for who reviews what), a pipeline assessment goes live
immediately on save — there's no separate publish step. A metric import is committed via the Admin
Import Panel's "Commit Import" button after "Preview" looks correct; every commit is logged and can be
rolled back if something was wrong.

## 15. Conduct QA — and know when to stop searching

Before marking a task `complete`:

- Reload the public page (`/places/chicago` or the metric/pipeline detail page) and confirm your data
  displays correctly — right stage, right badge, right dates.
- Re-read your neutral summary once for editorializing language (Handbook §2, §10) and remove any.
- Confirm every claim above Stage 0 has at least one cited piece of evidence.

**When to stop searching and mark "Unavailable" instead of continuing:** once you've made a genuine,
specific-query attempt across all three tiers (not just one lazy search) and found nothing — typically
after exhausting the responsible agency's own site, one academic/research-institute search, and one
search for named credible alternative coverage — stop. Continuing to dig indefinitely past that point has
negative expected value: it delays the queue and tempts a lower evidentiary bar just to "find something."
"Unavailable" is a correct, respected outcome, not a failure to report.

Set the task's final status to `complete` (or `unavailable` if that's the honest outcome) and update
`sourceStatus`/`notes` with a one-line summary of what you found or why it's unavailable, for the next
researcher's benefit.
