import { Link, useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoverageBar, CoverageLegend } from "@/components/research/CoverageBar";
import { useJurisdictionResearchDetail } from "@/hooks/useResearchMap";
import type { MetricDetailItem, PolicyAreaDetailItem } from "@mandate/shared";

const METRIC_STATUS_LABEL: Record<string, string> = {
  measured: "Measured",
  partial: "Partially Measured",
  unavailable: "Unavailable",
  unresearched: "Unresearched",
};

const METRIC_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  measured: "default",
  partial: "secondary",
  unavailable: "outline",
  unresearched: "outline",
};

const POLICY_STATUS_LABEL: Record<string, string> = {
  measured: "Researched",
  unavailable: "Unavailable",
  unresearched: "Unresearched",
};

export function ResearchJurisdictionDetailPage() {
  const { jurisdictionSlug } = useParams<{ jurisdictionSlug: string }>();
  const { data, isLoading } = useJurisdictionResearchDetail(jurisdictionSlug);

  if (isLoading) return <PageContainer><p className="text-muted-foreground">Loading…</p></PageContainer>;
  if (!data) return <PageContainer><p className="text-muted-foreground">Jurisdiction not found.</p></PageContainer>;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{data.jurisdictionName}</h1>
        <Link to="/research" className="text-sm text-muted-foreground hover:underline">
          ← Research Map
        </Link>
        <Link to={`/places/${data.jurisdictionSlug}`} className="text-sm text-muted-foreground hover:underline">
          View public profile →
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Overall research coverage: {data.overallCoveragePercent}%</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">Data Coverage</span>
              <span className="text-muted-foreground">{data.dataCoverage.coveragePercent}%</span>
            </div>
            <CoverageBar coverage={data.dataCoverage} />
            <CoverageLegend coverage={data.dataCoverage} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">Institutional Pipeline Coverage</span>
              <span className="text-muted-foreground">{data.pipelineCoverage.coveragePercent}%</span>
            </div>
            <CoverageBar coverage={data.pipelineCoverage} />
            <CoverageLegend coverage={data.pipelineCoverage} />
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Institutional Pipelines</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {data.policyAreas.map((p) => (
              <PolicyAreaRow key={p.policyAreaSlug} item={p} jurisdictionSlug={data.jurisdictionSlug} />
            ))}
          </ul>
        </CardContent>
      </Card>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Metrics</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {data.metrics.map((m) => (
              <MetricRow key={m.metricSlug} item={m} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function PolicyAreaRow({ item, jurisdictionSlug }: { item: PolicyAreaDetailItem; jurisdictionSlug: string }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
      <div>
        {item.status === "measured" ? (
          <Link to={`/places/${jurisdictionSlug}/pipeline/${item.policyAreaSlug}`} className="font-medium hover:underline">
            {item.policyAreaName}
          </Link>
        ) : (
          <span className="font-medium">{item.policyAreaName}</span>
        )}
        {item.categoryName && <span className="ml-2 text-xs text-muted-foreground">{item.categoryName}</span>}
      </div>
      <div className="flex items-center gap-2">
        {item.stage !== null && (
          <span className="text-xs text-muted-foreground">
            {item.stage}/5 · {item.stageLabel}
          </span>
        )}
        {item.openTask && (
          <Badge variant="secondary" className="text-xs">
            {item.openTask.status.replace("_", " ")}
          </Badge>
        )}
        <Badge variant={item.status === "measured" ? "default" : item.status === "unavailable" ? "outline" : "outline"}>
          {POLICY_STATUS_LABEL[item.status]}
        </Badge>
      </div>
    </li>
  );
}

function MetricRow({ item }: { item: MetricDetailItem }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
      <div>
        <Link to={`/metrics/${item.metricSlug}`} className="font-medium hover:underline">
          {item.metricName}
        </Link>
        <span className="ml-2 text-xs text-muted-foreground">{item.categoryName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {item.measuredYears} measured · {item.unavailableYears} unavailable · {item.unresearchedYears} unresearched
        </span>
        {item.openTask && (
          <Badge variant="secondary" className="text-xs">
            {item.openTask.status.replace("_", " ")}
          </Badge>
        )}
        <Badge variant={METRIC_STATUS_VARIANT[item.status]}>{METRIC_STATUS_LABEL[item.status]}</Badge>
      </div>
    </li>
  );
}
