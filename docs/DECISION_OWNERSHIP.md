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
and the Engineering Safety Audit) — so authentication itself doesn't distinguish individuals. A `User`
model now exists (see `docs/MANDATE_OPERATING_SYSTEM.md`, "User model") that gives real per-person
attribution on ResearchTask/PipelineAssessment/MetricValue rows — a researcher, reviewer, or jurisdiction
lead is a real database row with a name and role, not just a free-text string — but it is identity, not
login. Everyone still authenticates with the one shared admin password; a User row records WHO is acting,
it doesn't grant or restrict WHAT they can do at the HTTP layer. Real per-person login (so the decision
rights below are enforced by the server, not just by convention and the honor system) remains a
founder-level product decision, not something to build reactively.

## Formal decision-rights matrix

This is the granular version of the three-way split above, once a `User.role` exists to hang it on. It
governs what's available in the admin UI in spirit, not by server-enforced permission (see the limitation
above) — treat it as binding team policy, the same way "never delete production data without founder
sign-off" in `CONTRIBUTING.md` is binding despite not being a database constraint.

| Decision | researcher | reviewer | jurisdiction_lead | methodology_lead | founder |
|---|---|---|---|---|---|
| Pick up an unassigned task | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous |
| Select a source within the existing hierarchy | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous |
| Document limitations / uncertainty | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous |
| Propose a pipeline stage / data-quality label for a task they researched | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous |
| Mark their own task `awaiting_review` | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous |
| Review someone else's submitted work, request changes or approve | ❌ Not their own work | ✅ Autonomous | ✅ Autonomous (within their jurisdiction) | ✅ Autonomous | ✅ Autonomous |
| Reassign a task between researchers | ❌ | ⚠️ Own reviewees only | ✅ Autonomous (within their jurisdiction) | ⚠️ Methodology tasks only | ✅ Autonomous |
| Add a new Source Registry entry | ❌ Request via task/notes | ❌ Request via task/notes | ⚠️ Escalate to engineering | ⚠️ Escalate to engineering | ✅ Autonomous |
| Identify a research gap / stale data and open a new task | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous | ✅ Autonomous |
| Change a PolicyArea's or MetricDefinition's global scope/taxonomy | ❌ | ❌ | ❌ Flag it, don't silently do it | ✅ Autonomous | ✅ Autonomous |
| Change the Institutional Pipeline stage rubric or data-quality vocabulary itself | ❌ | ❌ | ❌ | ✅ Autonomous (bump `METHODOLOGY_VERSIONS`) | ✅ Autonomous |
| Resolve a methodological dispute between two researchers | ❌ Escalate | ⚠️ First attempt | ⚠️ First attempt (their jurisdiction) | ✅ Autonomous | ✅ Escalation of last resort |
| Overwrite/alter an already-`isCurrent` assessment's history in place | ❌ Never — add a new dated row instead | ❌ Never | ❌ Never | ❌ Never (same append-only rule applies to everyone) | ❌ Never (see `pipeline.service.ts`) |
| Edit another jurisdiction's research | ❌ | ❌ Unless assigned as reviewer there | ❌ Outside their own jurisdiction(s) | ✅ For methodology-conformance fixes only | ✅ Autonomous |
| Expand into a new city / new governance model | ❌ | ❌ | ❌ Propose it | ⚠️ Weigh in on methodology fit | ✅ Autonomous |
| Recruit a jurisdiction_lead / methodology_lead | ❌ | ❌ | ❌ | ❌ | ✅ Autonomous |

Legend: ✅ Autonomous = no sign-off needed. ⚠️ = conditional/limited scope, described in the cell. ❌ = not
this role's call; escalate per the "Founder decisions" / "Research team decisions" sections above.
