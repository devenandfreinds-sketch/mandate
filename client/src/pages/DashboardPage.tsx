import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceCard } from "@/components/governance/PlaceCard";
import { DataQualityBadge, dominantDataQuality } from "@/components/governance/DataQualityBadge";
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
              <DataQualityBadge
                dataQuality={dominantDataQuality(comparisonSeries.flatMap((s) => s.values.map((v) => v.dataQuality)))}
                className="mt-2"
              />
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
