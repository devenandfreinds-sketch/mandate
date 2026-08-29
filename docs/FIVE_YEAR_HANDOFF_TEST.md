# Five-Year Handoff Test

**The scenario.** The founder leaves at the end of this summer. Mandate is handed to six university
researchers (2 DePaul, 2 Purdue, 2 Illinois State) who have never met the founder, who remains available
only as an occasional advisor. Could they operate Mandate for five years? This document tests that
assumption against the actual documentation and architecture, not against how the founder assumes it
would go.

## Method

Every one of Mandate's operational documents (`RESEARCH_SOP.md`, `RESEARCHER_HANDBOOK.md`,
`FIRST_WEEK_ONBOARDING.md`, `CONTRIBUTING.md`, `FOUNDER_HANDOFF_CHECKLIST.md`,
`RESEARCHER_CERTIFICATION.md`, `PIPELINE_METHODOLOGY.md`, `RAILWAY_DEPLOYMENT.md`,
`CHICAGO_RESEARCH_ROADMAP.md`, `DECISION_OWNERSHIP.md`, `MANDATE_OPERATING_SYSTEM.md`) was read in full
looking specifically for: places that say "ask the founder" with no fallback; steps a new researcher
would need that aren't written down anywhere; and terminology drift between docs and actual code. The
`certificationLevel`/`role` vocabulary in `shared/src/types/user.ts` was cross-checked against
`RESEARCHER_CERTIFICATION.md` and `DECISION_OWNERSHIP.md`'s matrix.

## What already works (the encouraging finding)

`RESEARCHER_HANDBOOK.md` and `PIPELINE_METHODOLOGY.md` are genuinely self-contained — no founder-only
knowledge, no unstated prior context, written for a true zero-context undergraduate. The certification
ladder in code (`new_researcher → certified_researcher → senior_researcher → research_lead →
methodology_reviewer`) matches `RESEARCHER_CERTIFICATION.md` exactly, section for section, with no
naming drift. `CHICAGO_RESEARCH_ROADMAP.md` and `docs/GREATER_MANCHESTER_RESEARCH_ROADMAP.md` are both
real, actionable, seeded directly into the Research Queue as live `ResearchTask` rows — not aspirational
prose a new researcher has to translate into action themselves. The self-review guard, external
contribution isolation, and Research Passport provenance fields all work exactly as documented and
require zero founder involvement to operate day-to-day.

## Findings, classified and (where fixed) marked as such

### Critical (blocks the handoff scenario outright)

1. **No Railway ownership/credential transfer procedure.** `RAILWAY_DEPLOYMENT.md` described the
   current setup thoroughly but never how to add a collaborator, transfer ownership, or rotate
   `ADMIN_PASSWORD_HASH`/`SESSION_SECRET` when the founder steps back.
   **FIXED this pass** — added an "Access & ownership transfer" section to `RAILWAY_DEPLOYMENT.md`
   with concrete Railway-dashboard steps and a credential-rotation procedure.
2. **No documented way to get an account/admin password for the first time.** `RESEARCH_SOP.md` said
   "ask whoever set up your account" (unnamed); `FIRST_WEEK_ONBOARDING.md` never stated how Day 1
   access actually happens.
   **FIXED this pass** — added a "Getting access" section to `CONTRIBUTING.md` naming the three
   concrete things a new contributor needs (GitHub invite, admin password, communication channel) and
   who to get them from.
3. **No repo-access provisioning process.** `CONTRIBUTING.md` assumed `git clone` access already
   existed.
   **FIXED this pass** — same "Getting access" section covers this.
4. **Default reviewer bottleneck exactly at handoff time.** Both `DECISION_OWNERSHIP.md` and
   `FIRST_WEEK_ONBOARDING.md` default first-time review to "the founder," with no escalation path for
   exactly the scenario this test is built around: the founder being only occasionally available while
   no researcher has yet established trust.
   **FIXED this pass** — added an explicit escalation rule to `DECISION_OWNERSHIP.md`'s "gray area"
   section (senior-available-researcher fallback after 5 business days, with mandatory retroactive
   founder confirmation, self-review still forbidden).
5. **No named successor for founder-level backup/restore access.** Named as "founder-level, optionally
   shared with a designated technical lead" but nobody is actually designated.
   **PARTIALLY fixed** — the procedure for designating someone now exists (`RAILWAY_DEPLOYMENT.md`);
   actually naming a person is a real decision only the founder can make, not something fixable by
   documentation alone. Left as an explicit, visible action item rather than silently unaddressed.
6. **No communication channel documented anywhere.** No Slack, email list, or any coordination channel
   is named in any of the 11+ documents audited.
   **NOT fixed — cannot be, without the founder choosing a real tool.** Named explicitly in
   `RAILWAY_DEPLOYMENT.md`'s new section as an open decision the founder must make before onboarding
   real researchers, rather than a gap that stays invisible until six people show up with nowhere to
   coordinate.

### Important (real friction, doesn't block outright)

7. **Local dev environment setup was underspecified** (no Postgres install instructions, no example
   `DATABASE_URL`).
   **FIXED this pass** — `CONTRIBUTING.md`'s local-dev section now includes install/start commands and
   a concrete example connection string.
8. **Dangling reference to "the Engineering Safety Audit"** in both `FOUNDER_HANDOFF_CHECKLIST.md` and
   `DECISION_OWNERSHIP.md` — cited as if it were an existing standalone document; it isn't.
   **FIXED this pass** — both references now point at `docs/MANDATE_OPERATING_SYSTEM.md`'s "Remaining
   risks" section, which is where that content actually lives.
9. **`RAILWAY_DEPLOYMENT.md`'s deployment-verification step described the OLD cookie-based auth**,
   already replaced by bearer-token auth earlier this session — a real, separate documentation-drift
   bug found while fixing #1 above, unrelated to internationalization but exactly the kind of
   founder-only tribal knowledge (an undocumented architecture change) this test exists to catch.
   **FIXED this pass** — corrected to describe the current bearer-token mechanism.
10. **`CONTRIBUTING.md` claimed "no automated test suite" exists** — true when originally written, now
    false since this pass added `vitest` and real period-boundary tests.
    **FIXED this pass** — updated to describe the actual (intentionally minimal, not absent) test
    coverage.

### Nice to have (would help, not urgent)

11. **The handoff checklist's own core boxes are unchecked** — `FOUNDER_HANDOFF_CHECKLIST.md` explicitly
    states "a new researcher can complete a task independently" and "two researchers can operate the
    system" have never been exercised by a real non-founder. **Not fixed, and correctly so** — this is
    an honest, accurate status, not a documentation gap. The right fix is running the actual pilot with
    real researchers, not editing the checklist to claim something untested is proven. Recommended next
    step (see the final report): do this with 2-3 real researchers before the full six-person handoff.
12. A dedicated, named "who currently has founder-level access" registry (beyond "the founder,"
    prose-described) would reduce ambiguity further but isn't blocking anything today, since exactly one
    person currently holds every credential — the ambiguity only becomes real once a hand-off actually
    starts, which is precisely why item 5 above is flagged as a live decision, not a solved one.

## Second pass (2026-08-20): institutional hardening sprint

A separate, larger audit ("Mandate.city — Institutional Hardening & Research Expansion Sprint") re-ran
the same "could this operate for five years without the founder" question against the research
lifecycle, data quality architecture, frontend, infrastructure, documentation, and source registry, using
six parallel read-only audit passes plus one live incident that happened *during* the audit itself. That
incident is worth recording here on its own terms, since it's a real, first-hand instance of exactly the
failure mode this whole document exists to catch — not a hypothetical.

### A live example of the exact risk this document is about

Partway through this pass, the assistant carrying out the audit tried to commit a batch of real research
data and hit a hard failure: the local machine's `~/.gitconfig` had gone missing entirely (not just the
`user.name`/`user.email` fields — the file itself), and the machine's hostname had changed to something
unrelated to the founder's usual setup. Git could not even fall back to an auto-detected identity, the
way it normally does. **Nothing in any of Mandate's documentation says what to do when the founder's own
local git identity disappears** — because until now, every git action in Mandate's history had been
performed by one person on one consistently-configured machine, so this was never a scenario anyone had
reason to write down. The commit stayed queued, uncommitted, for the rest of the session while other
(non-git-dependent) work continued around it.

This is not really a "git bug" finding — `git config --global user.name`/`user.email` is a one-line fix
once you know to look for it. The actual finding is structural: **this is the first time in Mandate's
history that a routine action failed for a reason no document anticipated, and the fallback was "wait for
the one person who can fix their own machine."** In a genuine five-researcher handoff, an equivalent
snag — a laptop reimaged, a new machine, a corrupted local config — would hit a *researcher*, not the
founder, and nothing currently tells them what a healthy git identity should even look like before they
hit the error. **Recommended fix (not made this pass, since it's a documentation gap, not a bug):** add a
one-paragraph "if git refuses to commit, citing a missing identity" note to `CONTRIBUTING.md`'s local-dev
section, with the two-line `git config --global` fix. Trivial to write, currently not written anywhere.

### New findings from the six-part audit, same Critical/Important/Nice-to-have classification

**Critical**

13. **Research-queue drift from actual database state, caught live, three times.** Three `ResearchTask`
    seed entries (`chicago-unemployment-rate-metric`, `chicago-median-wages-metric`,
    `gm-crime-rate-metrics`) still had `researchQuestion` text claiming their metrics were "100%
    placeholder" long after the real data had been imported — and because the seed script legitimately
    refreshes `researchQuestion` text on every reseed (by design, so seed-file edits propagate), that
    stale claim was being re-written into the live database on every single deploy. One of the three
    (`gm-crime-rate-metrics`) had never even been marked `complete` — the underlying CSV import had
    happened through the direct import CLI, entirely outside the ResearchTask review workflow, so nothing
    ever told the queue the work was done. **FIXED this pass** for these three specific entries (text
    corrected, the missed one marked complete) — but the underlying mechanism (data can change via direct
    import without the corresponding task ever being touched) is not fixed, and will produce more stale
    entries exactly like these three unless research going through the CLI import path is paired with a
    habit of also updating the matching `ResearchTask`, which nothing currently enforces or reminds anyone
    to do.
14. **`ResearchTask.notes`/`sourceStatus`/`reviewNotes` and `ExternalContribution.reviewNotes` are single
    scalar fields, overwritten wholesale on every edit** — confirmed in the actual service code
    (`researchTask.service.ts`, `externalContribution.service.ts`) and the admin UI (saves on blur, no
    append-only log). A researcher's "I checked source X and rejected it because Y" reasoning is gone the
    moment a second person edits the same field. There is no `RejectedSourceNote` or equivalent anywhere
    in the schema — the concept of "considered and declined, with a reason" simply has no home. This is
    precisely the "hand off unfinished, mid-flight work" scenario named in the sprint brief, and today it
    fails silently rather than obviously. **Not fixed this pass** — the recommended shape (an append-only
    child table, following the exact pattern already used for `EvidenceLink`/`SupportingLegislation`
    hanging off `PipelineAssessment`) is additive and low-risk, but it's a new model, not a doc fix, so it
    was deliberately left as a documented recommendation rather than built without separate sign-off.

**Important**

15. **`ExternalContribution` has no state-transition validation**, unlike `ResearchTask` (which correctly
    gates `awaiting_review → complete` behind the accept action). Any `ExternalContribution` status can
    jump to any other status in any order today. Not exploited, not currently causing visible harm, but a
    real gap in the same institutional-integrity family as the self-review guard.
16. **The self-review guard is real, enforced code — but it protects against accidental self-review, not
    deliberate impersonation**, because there is no per-person login, only one shared admin password.
    `reviewerId` is whatever the client sends. This was already implicitly known (`DECISION_OWNERSHIP.md`
    already frames the shared password as "identity, not login"), but this pass confirmed it concretely
    against the actual guard code rather than assuming.
17. **A genuine institutional-pipeline overclaim was found and is not yet fixed**: Chicago's
    `affordable-housing-institution` entry claims Stage 4 ("operating with observable outputs"),
    `isCurrent: true`, dated 2026 — but its own `limitations` field admits the underlying DOH Annual
    Report evidence is stale through 2022, and `CHICAGO_RESEARCH_ROADMAP.md`'s top-line status summary
    doesn't carry that caveat forward. Not fixed this pass (it's a scoring judgment call, not a
    typo-level doc fix) — flagged for methodology-lead attention.
18. **Zero test coverage for the institutional-pipeline stage-scoring/transition logic** — the exact
    mechanism that produced finding 17. The repo's only two test files (`seriesQuality.test.ts`,
    `validators.test.ts`) are both good, but neither touches pipeline scoring.

### Bottom line for this second pass

The first pass's honest self-assessment holds up: the parts of Mandate that are schema/code-enforced
(self-review guard, append-only `PipelineAssessment` history, real per-person attribution, methodology
versioning) are genuinely solid and would survive researcher rotation with zero founder involvement. The
parts that are still just convention or free text — rejected-source reasoning, mid-task handoff notes,
keeping the research queue in sync with data that changed outside its own workflow — are exactly where
this pass found real, live instances of drift, not just theoretical risk. None of the new findings are
data-integrity emergencies; all of them are the kind of thing that gets quietly worse, one small
inconsistency at a time, the longer the founder isn't the only person touching the system.

## What this test could NOT fix, and why

Six of twelve findings are genuinely un-fixable by editing documentation, because they require a real
decision or action only the founder (or a real designated successor) can make: picking a communication
tool, actually inviting six people to GitHub, actually running the onboarding pilot, actually
designating a backup/restore successor, actually transferring Railway ownership, and actually rotating
the shared password when the time comes. Writing this document does not pretend otherwise — every item
above is marked with exactly what was and wasn't addressed, so a real handoff conversation starts from
an accurate list, not an optimistic one.
