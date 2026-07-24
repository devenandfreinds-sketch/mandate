import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceCard } from "@/components/governance/PlaceCard";
import { classifySeriesQuality } from "@mandate/shared";
import { SeriesQualityBadge, SeriesQualityBreakdownText } from "@/components/governance/SeriesQualityBadge";
import { MultiSeriesComparisonChart } from "@/components/charts/MultiSeriesComparisonChart";
import { useCategories, useCategoryMetricDefinitions } from "@/hooks/useCategories";
import { usePlaces } from "@/hooks/usePlace";
import { useMetricComparison } from "@/hooks/useMetricComparison";

export function DashboardPage() {
  const { data: categories } = useCategories();
  const { data: places } = usePlaces();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const activeCategory = selectedCategory ?? categories?.[0]?.slug;
  const { data: metricDefs } = useCategoryMetricDefinitions(activeCategory);
  const headlineMetricSlug = metricDefs?.[0]?.slug;

  const jurisdictionSlugs = places?.map((p) => p.slug) ?? [];
  const { data: comparisonSeries, isLoading: isComparisonLoading } = useMetricComparison(headlineMetricSlug, jurisdictionSlugs);

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Compare performance across governance models by category.</p>

      {categories && (
        <Tabs value={activeCategory} onValueChange={setSelectedCategory} className="mt-6">
          <TabsList className="flex-wrap">
            {categories.map((c) => (
              <TabsTrigger key={c.slug} value={c.slug}>
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{metricDefs?.[0]?.name ?? "Loading metric…"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isComparisonLoading && <p className="text-sm text-muted-foreground">Loading comparison…</p>}
          {comparisonSeries && comparisonSeries.length > 0 && (
            <>
              <MultiSeriesComparisonChart seriesList={comparisonSeries} />
              {(() => {
                // Cross-jurisdiction comparison, not one place's time series -- this is a coarser
                // "how much of this comparison is real" signal, so the recency/fragmentation modifiers
                // (designed for one place's chronological history) don't cleanly apply across several
                // jurisdictions' overlapping years. The evidence-fraction classification still gives a
                // materially more honest read than the old "one placeholder jurisdiction taints
                // everything" reducer.
                const quality = classifySeriesQuality(comparisonSeries.flatMap((s) => s.values));
                return (
                  <>
                    <SeriesQualityBadge result={quality} className="mt-2" />
                    <SeriesQualityBreakdownText result={quality} />
                  </>
                );
              })()}
            </>
          )}
        </CardContent>
      </Card>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Cities & Regions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places?.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
