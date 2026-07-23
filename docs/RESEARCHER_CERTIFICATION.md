# Researcher Certification

How a researcher's standing in Mandate grows over time, and what that unlocks. This is deliberately
**not** a numeric performance score (see `docs/MANDATE_OPERATING_SYSTEM.md`, "Researcher Certification
System" for why) — it's a small set of levels, each defined by demonstrated judgment on real, reviewed
work. University prestige, tenure, or self-assessment play no role in advancement.

The five levels are stored on a researcher's `User.certificationLevel` (see `shared/src/types/user.ts`):

## New Researcher

Where everyone starts. Onboarding, or has completed fewer than a handful of reviewed tasks. Work should
go through review before it's treated as final — not because a new researcher's work is presumed weak,
but because the review step is how trust gets established in the first place, for both the researcher and
the system.

**Advances by:** completing several tasks (roughly 3-5, not a hard rule) where a reviewer's feedback shows
consistent accuracy, correct source-tier judgment, and honest documentation of uncertainty — not zero
revisions, but revisions that reflect normal back-and-forth rather than fundamental methodology
misunderstandings.

## Certified Researcher

Has a track record of methodologically sound, well-documented submissions. Can be trusted to work more
independently; review still happens but can be lighter-touch (spot-checking the conclusion and sourcing
rather than re-deriving the whole assessment).

**Advances by:** demonstrated judgment on genuinely ambiguous cases — the ones the Handbook and SOP don't
cleanly answer — where the researcher either reasoned correctly to a conservative conclusion or correctly
flagged the ambiguity back to a reviewer/methodology lead rather than guessing.

## Senior Researcher

Trusted with minimal review on routine tasks. Their judgment on stage/data-quality assignments is treated
as close to final; a reviewer's role shifts from "check the reasoning" to "sanity-check the summary."

**Advances by:** a pattern of catching methodological subtleties other researchers miss (source-tier
mismatches, composite-scoring edge cases, denominator/methodology inconsistencies across years), and by
mentoring newer researchers effectively (this is a real signal, gathered informally, not a separate
metric).

## Research Lead

Can coordinate other researchers and review their work; typically paired with the `jurisdiction_lead`
role (see the decision-rights matrix in `docs/DECISION_OWNERSHIP.md`) but the two are independent — a
Research Lead's certification reflects research judgment, `jurisdiction_lead` reflects an assigned
coordination responsibility for a specific city or set of policy areas.

**Advances by:** methodology_lead or founder sign-off, based on a track record of good review decisions
(not just good research) — has this person correctly caught other people's mistakes, and given feedback
that helped a researcher actually improve rather than just comply?

## Methodology Reviewer

Trusted to weigh in on methodology disputes and proposed changes to `METHODOLOGY_VERSIONS`
(`shared/src/types/methodology.ts`). Typically paired with the `methodology_lead` role. This is the
highest level precisely because it's the hardest to get wrong safely — a bad methodology call propagates
into every future assessment made under it, unlike a bad individual research call, which is scoped to one
data point.

**Advances by:** explicit founder decision only (see `docs/DECISION_OWNERSHIP.md`, "Founder decisions" —
"Recruiting/hiring leadership roles").

## What this system deliberately rewards (and doesn't)

Per the founder's explicit instruction, this ladder rewards:

- **Accuracy** — did the conclusion hold up under review and later scrutiny?
- **Reliability** — does this person consistently finish what they start, without needing to be chased?
- **Learning speed** — how quickly did early mistakes stop recurring?
- **Intellectual rigor** — does this person's reasoning survive a skeptical read, not just a friendly one?
- **Consistency** — is quality stable across many tasks, not just their best work?
- **Ability to document uncertainty** — does this person mark "unavailable" honestly instead of guessing,
  and write limitations sections that would actually help a future researcher?
- **Ability to improve the workflow** — did this person's feedback make the Handbook, SOP, or Research
  Queue better for the next person?

It deliberately does **not** reward: which university someone attends, how long someone has been involved,
how much research volume someone produces (volume without accuracy is not the goal), or self-reported
confidence.

## How advancement actually happens (mechanically, today)

There is no automated scoring pipeline computing this — see "Do NOT create a simplistic performance
score" in the founder's own instructions. Advancement is a judgment call by a reviewer, jurisdiction_lead,
methodology_lead, or founder (per the level), made by updating the researcher's `certificationLevel` field
on `/admin/users` (see `client/src/pages/admin/AdminUsersPage.tsx`). The `ResearchTask.revisionCount` field
(incremented automatically whenever a task is sent back with `changes_requested`) is one honest, real
signal available to inform that judgment — not a threshold that triggers advancement by itself.
