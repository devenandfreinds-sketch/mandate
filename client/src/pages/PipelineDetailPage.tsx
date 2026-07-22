import { Link, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataQualityBadge } from "@/components/governance/DataQualityBadge";
import { PipelineStageBadge } from "@/components/charts/PipelineStageBadge";
import { usePipelineHistory } from "@/hooks/usePlaceMetrics";
import { formatUtcDate } from "@/lib/utils";
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

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PipelineStageBadge stage={current.stage} label={current.stageLabel} />
        <DataQualityBadge dataQuality={current.dataQuality} />
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Pipeline scores measure institutional development and implementation maturity, not ideological agreement.{" "}
        <Link to="/methodology/pipeline" className="underline">
          How is this scored?
        </Link>
      </p>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Neutral Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {current.evidenceSummary ?? "No summary documented yet for this assessment."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assessment Date &amp; Last Updated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <div>Assessed as of: {formatDate(current.assessmentDate)}</div>
            <div>Last updated: {formatDate(current.updatedAt)}</div>
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
            <CardTitle className="text-base">Evidence Supporting the Current Score</CardTitle>
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
            <CardTitle className="text-base">Limitations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {current.limitations ?? "No known limitations documented for this assessment yet."}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
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
