import { Link } from "react-router-dom";
import { classifySeriesQuality, type MetricSeries } from "@mandate/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { SeriesQualityBadge, SeriesQualityBreakdownText } from "./SeriesQualityBadge";
import { categoryChartColor } from "@/lib/utils";

export function CategorySection({ seriesList }: { seriesList: MetricSeries[] }) {
  if (seriesList.length === 0) {
    return <p className="text-sm text-muted-foreground">No metrics available for this category yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {seriesList.map((series) => {
        const quality = series.values.length > 0 ? classifySeriesQuality(series.values) : null;
        return (
          <Card key={series.metricDefinition.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <Link to={`/metrics/${series.metricDefinition.slug}`} className="text-sm font-medium hover:underline">
                  {series.metricDefinition.name}
                </Link>
                {quality && <SeriesQualityBadge result={quality} />}
              </div>
              {quality && <SeriesQualityBreakdownText result={quality} />}
            </CardHeader>
            <CardContent>
              {series.values.length > 0 ? (
                <TimeSeriesChart series={series} color={categoryChartColor(series.metricDefinition.categorySlug)} height={200} />
              ) : (
                <p className="text-sm text-muted-foreground">No data available.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
