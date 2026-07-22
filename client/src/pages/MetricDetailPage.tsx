import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataQualityBadge } from "@/components/governance/DataQualityBadge";
import { useMetricDefinition } from "@/hooks/useMetricDefinitions";
import { formatUtcDate } from "@/lib/utils";

const formatDate = formatUtcDate;

export function MetricDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: metric, isLoading } = useMetricDefinition(slug);

  if (isLoading) return <PageContainer><p className="text-muted-foreground">Loading…</p></PageContainer>;
  if (!metric) return <PageContainer><p className="text-muted-foreground">Metric not found.</p></PageContainer>;

  const coverageYears =
    metric.coverage.periodStart && metric.coverage.periodEnd
      ? `${new Date(metric.coverage.periodStart).getUTCFullYear()}–${new Date(metric.coverage.periodEnd).getUTCFullYear()}`
      : "No data yet";

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{metric.name}</h1>
        <Badge variant="secondary">{metric.categorySlug}</Badge>
      </div>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Definition</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{metric.description}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Units</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {metric.unit} · {metric.higherIsBetter ? "higher is better" : "lower is better"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calculation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {metric.calculationMethod ?? "Not yet documented for this metric."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {metric.primarySource ? (
              <div className="space-y-1">
                <div className="font-medium text-foreground">{metric.primarySource.name}</div>
                {metric.primarySource.publisher && <div>{metric.primarySource.publisher}</div>}
                {metric.primarySource.updateFrequency && <div>Update frequency: {metric.primarySource.updateFrequency}</div>}
                {metric.primarySource.url && (
                  <a href={metric.primarySource.url} target="_blank" rel="noreferrer" className="text-foreground underline">
                    View source
                  </a>
                )}
              </div>
            ) : (
              "No canonical source assigned yet — individual observations still carry their own source attribution."
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last Updated</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{formatDate(metric.lastUpdated)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              {metric.coverage.jurisdictionCount} jurisdiction{metric.coverage.jurisdictionCount === 1 ? "" : "s"} · {coverageYears} ·{" "}
              {metric.coverage.valueCount} observations
            </div>
            {metric.coverageNote && <div>{metric.coverageNote}</div>}
            <div className="flex gap-2 pt-1">
              {Object.entries(metric.coverage.dataQualityBreakdown).map(([quality, count]) => (
                <div key={quality} className="flex items-center gap-1">
                  <DataQualityBadge dataQuality={quality} />
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Limitations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {metric.limitations ?? "No known limitations documented for this metric yet."}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
