import { Link } from "react-router-dom";
import type { MetricSeries } from "@mandate/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { DataQualityBadge, dominantDataQuality } from "./DataQualityBadge";
import { categoryChartColor } from "@/lib/utils";

export function CategorySection({ seriesList }: { seriesList: MetricSeries[] }) {
  if (seriesList.length === 0) {
    return <p className="text-sm text-muted-foreground">No metrics available for this category yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {seriesList.map((series) => (
        <Card key={series.metricDefinition.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <Link to={`/metrics/${series.metricDefinition.slug}`} className="text-sm font-medium hover:underline">
                {series.metricDefinition.name}
              </Link>
              {series.values.length > 0 && (
                <DataQualityBadge dataQuality={dominantDataQuality(series.values.map((v) => v.dataQuality))} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {series.values.length > 0 ? (
              <TimeSeriesChart series={series} color={categoryChartColor(series.metricDefinition.categorySlug)} height={200} />
            ) : (
              <p className="text-sm text-muted-foreground">No data available.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
