# Mandate Founder-to-Team Handoff Checklist

What must be true before the founder can step back from day-to-day operations and let the research team
run independently during the academic year. Status reflects the state after this hardening pass.

- [x] Research methodology documented — `docs/PIPELINE_METHODOLOGY.md`, `docs/RESEARCHER_HANDBOOK.md`
- [x] Source hierarchy documented — `docs/RESEARCH_SOP.md` §4-6
- [x] Pipeline methodology documented — `docs/PIPELINE_METHODOLOGY.md`, `/methodology/pipeline`
- [x] Research SOP documented — `docs/RESEARCH_SOP.md`
- [x] Research queue exists — `/admin/research-queue`, seeded with the current Top 10
- [x] Chicago roadmap exists — `docs/CHICAGO_RESEARCH_ROADMAP.md`
- [x] Contributor documentation exists — `CONTRIBUTING.md`
- [x] Local development documented — `CONTRIBUTING.md`, `README.md`
- [x] Production deployment documented — `docs/RAILWAY_DEPLOYMENT.md`
- [x] Database backup/recovery procedure documented — `docs/RAILWAY_DEPLOYMENT.md` § "Database backup &
      recovery": how to create a backup, where to store it, how often, how to restore (scratch-database
      verification first, always), and who has access (founder-level, not delegated to researchers).
      Note this documents a **manual procedure** — no automated backup job actually runs yet; see
      "Remaining founder bottlenecks" below.
- [ ] **New researcher can complete a task independently** — the onboarding path now exists
      (`docs/FIRST_WEEK_ONBOARDING.md`), but it has not yet been run by an actual new researcher. This
      checkbox should only be checked after someone who isn't the founder has actually completed a Day
      1-5 cycle and produced a real, live contribution without live founder assistance.
- [ ] **At least two researchers can operate the system** — mechanically possible today (they'd share the
      one admin password), but untested with real people, and there's no per-researcher attribution
      beyond the free-text "Assigned to" field on a queue task — see the Engineering Safety Audit and
      Decision Ownership doc for the implication.
- [ ] **At least one researcher can perform a complete pipeline assessment** — same caveat: the workflow
      supports this and is documented, but hasn't yet been exercised by someone other than the founder.
- [ ] **Founder is no longer required for routine research decisions** — depends on the three items
      above; not yet true, because they haven't been exercised by real researchers yet. This checklist
      item is the actual finish line for the handoff — everything else is preparation for it.

## What "done" looks like for the remaining four items

Run one real researcher (ideally two, in parallel) through `docs/FIRST_WEEK_ONBOARDING.md` with the
founder deliberately *not* answering questions that the Handbook/SOP/roadmap already cover — only
stepping in for genuinely new situations those documents don't address. Every time the founder has to
step in, that's a signal: either the documentation has a real gap (fix it) or the researcher needs more
runway (that's normal and not a documentation failure). After two researchers have each completed a real
metric and a real (or paired) pipeline assessment without founder hand-holding, the last four checklist
items are honestly satisfied.
