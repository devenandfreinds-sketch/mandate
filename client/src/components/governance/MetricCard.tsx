import { Link } from "react-router-dom";
import { classifySeriesQuality, type MetricSeries } from "@mandate/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricSparkline } from "@/components/charts/MetricSparkline";
import { SeriesQualityBadge } from "@/components/governance/SeriesQualityBadge";
import { formatMetricValue, categoryChartColor } from "@/lib/utils";

export function MetricCard({ series }: { series: MetricSeries }) {
  const latest = series.values[series.values.length - 1];
  const first = series.values[0];
  const change = latest && first && first.value !== 0 ? ((latest.value - first.value) / Math.abs(first.value)) * 100 : null;
  const color = categoryChartColor(series.metricDefinition.categorySlug);
  const quality = classifySeriesQuality(series.values);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <Link to={`/metrics/${series.metricDefinition.slug}`} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline">
            {series.metricDefinition.name}
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">
          {latest ? formatMetricValue(latest.value, series.metricDefinition.unit, series.metricDefinition.decimalPrecision, latest.currencyCode) : "—"}
        </div>
        {change !== null && (
          <div className={`text-xs ${change >= 0 === series.metricDefinition.higherIsBetter ? "text-emerald-600" : "text-red-500"}`}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}% since {first.periodLabel}
          </div>
        )}
        <div className="mt-2">
          <MetricSparkline values={series.values} color={color} />
        </div>
        <SeriesQualityBadge result={quality} className="mt-2" />
      </CardContent>
    </Card>
  );
}
