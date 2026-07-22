# Decision Ownership: Founder vs. Research Team vs. Engineering

Who decides what, so the research team doesn't need to ask the founder about things that are actually
theirs to decide, and the founder isn't accidentally left out of things that genuinely require them.

## Founder decisions

Things that change what Mandate fundamentally *is*, or carry legal/relationship/strategic weight beyond
any single researcher's scope:

- Core methodology changes (the meaning of a pipeline stage, the data-quality vocabulary itself)
- Major scoring-rule changes (e.g. changing the composite-scoring rule in
  `docs/PIPELINE_METHODOLOGY.md` §6)
- Expansion into new cities or new governance models
- Governance model definitions (what counts as a distinct "governance model" grouping)
- Major product architecture changes
- Public positioning, messaging, and how Mandate describes its own neutrality
- Partnerships (with universities, data providers, media)
- Recruiting/hiring leadership roles on the research team

## Research team decisions

Things that are genuinely the researchers' call, within the methodology as already documented:

- Which specific task to pick up next from the queue (subject to priority ordering)
- How to word a specific neutral summary or limitations section
- Which specific sources to cite for a specific claim (subject to the Tier 1/2/3 rules)
- The specific stage/data-quality assignment for a specific assessment, once evidence is gathered
  (this is the core research judgment call the whole system is built to support)
- Requesting a new Source Registry entry (an engineer executes it, but the researcher identifies the
  need)
- Flagging a methodology ambiguity the Handbook doesn't cover (this should go back to the founder as a
  proposed *addition* to the Handbook, not be silently resolved case-by-case)

## Engineering decisions

Things that are implementation details, not research judgment:

- How the research queue, admin forms, or data model are structured
- Seed script idempotency/safety mechanics
- Deployment configuration and process
- Performance, code organization, dependency choices
- Bug fixes that don't change methodology (e.g. a date-display bug, a missing validation check)

## The one deliberate gray area: reviewing a submitted assessment

Right now, there is **no formal review-assignment system** — the Research Queue's `awaiting_review`
status exists, but nothing routes a review to a specific person. Until a second trusted researcher is
established, review of a submitted pipeline assessment should default to the **founder**, since a wrong
score is a methodology-credibility issue, not just a data-entry issue. Once the founder has confidence in
a specific researcher's judgment (demonstrated over several completed tasks), review authority for that
researcher's future submissions can explicitly shift to another researcher — but that's a founder call to
make explicitly, not something that should drift by default.

## Known limitation this creates

There is currently one shared admin login for the whole team (see `docs/FOUNDER_HANDOFF_CHECKLIST.md`
and the Engineering Safety Audit) — so "who reviewed this" and "who submitted this" both rely on the
free-text `assignedResearcher` field on a Research Queue task and on researchers' own honesty/diligence
in filling it in, not on real authentication. This is an acceptable tradeoff for a 2-3 person team but
would need real per-researcher accounts before scaling further — that's a founder-level product decision
(see "Founder decisions" above), not something to build reactively.
