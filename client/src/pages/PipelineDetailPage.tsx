import { Link, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataQualityBadge } from "@/components/governance/DataQualityBadge";
import { PipelineStageBadge } from "@/components/charts/PipelineStageBadge";
import { MetricSparkline } from "@/components/charts/MetricSparkline";
import { usePipelineHistory, usePlaceMetrics } from "@/hooks/usePlaceMetrics";
import { formatUtcDate, formatMetricValue } from "@/lib/utils";
import { SOURCE_TIERS } from "@mandate/shared";
import type { EvidenceLink, SupportingLegislation } from "@mandate/shared";

const formatDate = formatUtcDate;

function tierLabel(tier: string | null): string {
  return SOURCE_TIERS.find((t) => t.tier === tier)?.label ?? (tier ?? "Unspecified tier");
}

export function PipelineDetailPage() {
  const { jurisdictionSlug, policyAreaSlug } = useParams<{ jurisdictionSlug: string; policyAreaSlug: string }>();
  const { data: history, isLoading } = usePipelineHistory(jurisdictionSlug, policyAreaSlug);

  if (isLoading) return <PageContainer><p className="text-muted-foreground">Loading…</p></PageContainer>;
  if (!history || history.length === 0) return <PageContainer><p className="text-muted-foreground">No pipeline assessment found.</p></PageContainer>;

  const current = history.find((a) => a.isCurrent) ?? history[history.length - 1];
  const timeline = [...history].sort((a, b) => new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime());

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{current.policyAreaName}</h1>
        {current.categoryName && <Badge variant="secondary">{current.categoryName}</Badge>}
        <Link to={`/places/${jurisdictionSlug}`} className="text-sm text-muted-foreground hover:underline">
          ← Back to {jurisdictionSlug}
        </Link>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        This page separates what the evidence shows from what Mandate concluded from it — see{" "}
        <Link to="/methodology/pipeline" className="underline">
          how pipeline stages are scored
        </Link>
        .
      </p>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">1. What The Evidence Shows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {current.legislation.length === 0 && current.evidenceLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No evidence records attached to this assessment yet.</p>
            ) : (
              <>
                {current.legislation.map((l) => (
                  <LegislationRow key={l.id} legislation={l} />
                ))}
                {current.evidenceLinks.map((e) => (
                  <EvidenceRow key={e.id} evidence={e} />
                ))}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">2. Mandate's Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <PipelineStageBadge stage={current.stage} label={current.stageLabel} />
              <DataQualityBadge dataQuality={current.dataQuality} />
            </div>
            <p className="text-sm text-muted-foreground">
              {current.evidenceSummary ?? "No summary documented yet for why this stage was assigned."}
            </p>
            <p className="text-xs text-muted-foreground">
              Assessed as of {formatDate(current.assessmentDate)} · last updated {formatDate(current.updatedAt)}. This stage reflects
              institutional maturity, not whether the underlying policy is a good idea.
            </p>
          </CardContent>
        </Card>

        {current.categorySlug && (
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">3. Does It Show Up In The Outcome Data?</CardTitle>
            </CardHeader>
            <CardContent>
              <OutcomeMetricPreview jurisdictionSlug={jurisdictionSlug} categorySlug={current.categorySlug} categoryName={current.categoryName} />
            </CardContent>
          </Card>
        )}

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">4. Limitations &amp; Interpretation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground/70">Analyst judgment, not raw evidence</p>
            {current.limitations ?? "No known limitations documented for this assessment yet."}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Timeline of Institutional Development</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length <= 1 ? (
              <p className="text-sm text-muted-foreground">No prior assessments recorded yet — this is the first.</p>
            ) : (
              <ol className="space-y-3 border-l border-border pl-4">
                {timeline.map((a) => (
                  <li key={a.id}>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">{formatDate(a.assessmentDate)}</span>
                      <PipelineStageBadge stage={a.stage} label={a.stageLabel} />
                      {a.isCurrent && <Badge variant="outline">Current</Badge>}
                    </div>
                    {a.evidenceSummary && <p className="mt-1 text-sm text-muted-foreground">{a.evidenceSummary}</p>}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Research Passport</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2">
            <div>Researched by: {current.researchedByName ?? "Not recorded"}</div>
            <div>Reviewed by: {current.reviewedByName ?? "Not yet reviewed"}</div>
            <div>Reviewed at: {current.reviewedAt ? formatDate(current.reviewedAt) : "Not yet reviewed"}</div>
            <div>Methodology version: {current.methodologyVersion ?? "Not recorded"}</div>
            <div className="sm:col-span-2">Next scheduled review: {current.nextReviewDate ? formatDate(current.nextReviewDate) : "Not yet scheduled"}</div>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}

/**
 * Connects institutional maturity (the stage above) to whatever outcome metrics this project
 * already tracks for the same category+jurisdiction -- so a viewer can ask "the institution is
 * rated as operating/improving, but does the outcome data actually back that up?" without leaving
 * the page. Picks the series with the most non-placeholder values as the most informative one to
 * show; falls back to the first series if every one is still placeholder.
 */
function OutcomeMetricPreview({
  jurisdictionSlug,
  categorySlug,
  categoryName,
}: {
  jurisdictionSlug: string | undefined;
  categorySlug: string;
  categoryName: string | null;
}) {
  const { data: seriesList, isLoading } = usePlaceMetrics(jurisdictionSlug, categorySlug);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading outcome metrics…</p>;
  if (!seriesList || seriesList.length === 0) {
    return <p className="text-sm text-muted-foreground">No {categoryName ?? "category"} metrics tracked for this jurisdiction yet.</p>;
  }

  const bestSeries = [...seriesList].sort((a, b) => {
    const realCount = (s: typeof a) => s.values.filter((v) => v.dataQuality !== "placeholder").length;
    return realCount(b) - realCount(a);
  })[0];

  const sortedValues = [...bestSeries.values].sort((a, b) => new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime());
  const latest = sortedValues[sortedValues.length - 1];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{bestSeries.metricDefinition.name}</span>
        {latest && <DataQualityBadge dataQuality={latest.dataQuality} />}
      </div>
      {sortedValues.length >= 2 ? (
        <MetricSparkline values={sortedValues} height={56} />
      ) : (
        <p className="text-sm text-muted-foreground">Not enough real data points yet for a trend.</p>
      )}
      {latest && (
        <p className="text-sm text-muted-foreground">
          Most recent: {formatMetricValue(latest.value, bestSeries.metricDefinition.unit, bestSeries.metricDefinition.decimalPrecision, latest.currencyCode)}{" "}
          ({latest.periodLabel})
        </p>
      )}
      <Link to={`/places/${jurisdictionSlug}?category=${categorySlug}#historical-charts`} className="text-sm underline">
        View all {categoryName ?? "category"} metrics for {jurisdictionSlug} →
      </Link>
    </div>
  );
}

function LegislationRow({ legislation }: { legislation: SupportingLegislation }) {
  return (
    <div className="rounded-md border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Legislation</Badge>
        <span className="font-medium text-foreground">{legislation.title}</span>
        {legislation.status && <span className="text-xs text-muted-foreground">({legislation.status})</span>}
      </div>
      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        {legislation.billNumber && <div>{legislation.billNumber}</div>}
        {legislation.dateEnacted && <div>Enacted: {formatDate(legislation.dateEnacted)}</div>}
        {legislation.url && (
          <a href={legislation.url} target="_blank" rel="noreferrer" className="underline">
            View source
          </a>
        )}
      </div>
    </div>
  );
}

function EvidenceRow({ evidence }: { evidence: EvidenceLink }) {
  return (
    <div className="rounded-md border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{evidence.evidenceType}</Badge>
        {evidence.sourceTier && <Badge variant="secondary">{tierLabel(evidence.sourceTier)}</Badge>}
        <span className="font-medium text-foreground">{evidence.label}</span>
      </div>
      {evidence.description && <p className="mt-1 text-sm text-muted-foreground">{evidence.description}</p>}
      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        {evidence.publisher && <div>{evidence.publisher}</div>}
        {evidence.publicationDate && <div>Published: {formatDate(evidence.publicationDate)}</div>}
        <a href={evidence.url} target="_blank" rel="noreferrer" className="underline">
          View source
        </a>
      </div>
    </div>
  );
}
