import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PIPELINE_STAGE_DEFINITIONS, SOURCE_TIERS } from "@mandate/shared";

export function PipelineMethodologyPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Institutional Pipeline Index — Methodology</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">
        Mandate evaluates institutional development and measurable implementation — not ideological
        correctness. The same framework applies to any political movement or governing administration,
        left, right, or otherwise: the question is always whether a governing coalition built a durable
        institution and can show it produced results, not whether Mandate agrees with the policy itself.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">What does a pipeline score measure?</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Each score (0–5) tracks a single policy area (e.g. "Affordable Housing Production Institution")
          in a single jurisdiction, answering one question at a time: did the administration promise
          something, did they legally establish it, did they build an institution to carry it out, is
          that institution operating, and is there evidence it's producing results. A score is a snapshot
          of institutional maturity at a point in time — jurisdictions accumulate a <em>history</em> of
          assessments as they progress (or stall, or reverse), not a single static number.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">The unit of analysis: the pipeline, not a project</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          A score describes the institutional pipeline for a policy area as a whole — the durable
          mechanism(s) capable of planning, funding, and executing that policy — not whichever single
          project within it happens to be furthest along. A jurisdiction does <strong>not</strong>{" "}
          receive a Stage 4 or Stage 5 score merely because one flagship project is operating or has
          shown results; the overall institutional mechanism must support that score. If a city has one
          completed program alongside several others still stuck at proposal or under-construction
          stages, the composite score reflects the ecosystem's actual maturity, not its best individual
          output. When governance is fragmented across multiple agencies or levels of government (a
          transit network jointly run by a city, a regional authority, and federal funders, for example),
          the score should reflect the pipeline's overall coherence and durability, not the single
          strongest agency's output in isolation. This is a deliberate, conservative rule: it is meant to
          make Mandate resistant to cherry-picking a good headline as evidence of institutional maturity.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">What does it not measure?</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          It does not measure whether the underlying policy is good or bad, whether Mandate agrees with
          it, or how popular it is. A policy can score a 5 (measurable, improving results) regardless of
          its political orientation, and a policy Mandate's editors might personally favor can — and
          often does — score a 0 or 1 if no legislation or institution has actually materialized.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">How is a score determined?</h2>
        <div className="space-y-3">
          {PIPELINE_STAGE_DEFINITIONS.map((d) => (
            <Card key={d.stage}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Badge variant="secondary">{d.stage}</Badge>
                  {d.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <div className="italic">"{d.question}"</div>
                <div>{d.criteria}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">What counts as evidence?</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Every assessment above stage 0 should be backed by at least one evidence record: enacted
          legislation or ordinance text, an official government report or dataset, an academic study, or
          — when neither exists — a credible alternative source such as established nonprofit or industry
          data. Evidence records carry a type, a description, a publication date where available, a
          publisher, and a source tier, so a reader can judge the strength of the citation without
          following the link.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">What are the source tiers?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {SOURCE_TIERS.map((t) => (
            <Card key={t.tier}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{t.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">How is unavailable data handled?</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Every assessment carries a data-quality label — Government, Academic, Alternative, Estimated,
          Unavailable, or Placeholder — the same vocabulary used across Mandate's metrics. A score backed
          by a chart-derived or approximated figure is labeled Estimated, not Government, even if the
          underlying institution's existence is confirmed by an official source. A policy area with no
          responsibly sourceable evidence at all is marked Unavailable rather than silently guessed at.
          Placeholder indicates a category that has not yet been researched — it is not a score, and
          should never be read as equivalent to a verified assessment.
        </p>
      </section>
    </PageContainer>
  );
}
