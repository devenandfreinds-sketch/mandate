import { prisma } from "../db.js";
import { mapSource } from "./source.service.js";
import type { DataCatalogEntry, DataCatalogResponse } from "@mandate/shared";

export async function getDataCatalog(): Promise<DataCatalogResponse> {
  const [metricDefs, jurisdictions, values] = await Promise.all([
    prisma.metricDefinition.findMany({
      include: { category: true, primarySource: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.jurisdiction.findMany({ select: { id: true, slug: true } }),
    prisma.metricValue.findMany({
      select: { metricDefinitionId: true, jurisdictionId: true, dataQuality: true, periodStart: true },
    }),
  ]);

  const jurisdictionSlugById = new Map(jurisdictions.map((j) => [j.id, j.slug]));
  const allJurisdictionSlugs = jurisdictions.map((j) => j.slug).sort();

  const valuesByMetric = new Map<string, typeof values>();
  for (const v of values) {
    const list = valuesByMetric.get(v.metricDefinitionId) ?? [];
    list.push(v);
    valuesByMetric.set(v.metricDefinitionId, list);
  }

  const entries: DataCatalogEntry[] = metricDefs.map((def) => {
    const metricValues = valuesByMetric.get(def.id) ?? [];
    const realValues = metricValues.filter((v) => v.dataQuality !== "placeholder");

    const dataQualityBreakdown: Record<string, number> = {};
    for (const v of metricValues) {
      dataQualityBreakdown[v.dataQuality] = (dataQualityBreakdown[v.dataQuality] ?? 0) + 1;
    }

    const jurisdictionsWithRealData = Array.from(
      new Set(realValues.map((v) => jurisdictionSlugById.get(v.jurisdictionId)).filter((s): s is string => Boolean(s)))
    ).sort();
    const jurisdictionsMissing = allJurisdictionSlugs.filter((s) => !jurisdictionsWithRealData.includes(s));

    const realYears = realValues.map((v) => v.periodStart.getUTCFullYear());

    return {
      metricSlug: def.slug,
      metricName: def.name,
      categorySlug: def.category.slug,
      categoryName: def.category.name,
      description: def.description,
      unit: def.unit,
      higherIsBetter: def.higherIsBetter,
      calculationMethod: def.calculationMethod,
      limitations: def.limitations,
      primarySource: def.primarySource ? mapSource(def.primarySource) : null,
      jurisdictionsTotal: allJurisdictionSlugs.length,
      jurisdictionsWithRealData,
      jurisdictionsMissing,
      completionPercent: allJurisdictionSlugs.length
        ? Math.round((jurisdictionsWithRealData.length / allJurisdictionSlugs.length) * 100)
        : 0,
      dataQualityBreakdown,
      totalObservations: metricValues.length,
      firstRealYear: realYears.length ? Math.min(...realYears) : null,
      lastRealYear: realYears.length ? Math.max(...realYears) : null,
      isFullyPlaceholder: realValues.length === 0,
    };
  });

  const totalMetrics = entries.length;
  const metricsWithAnyRealData = entries.filter((e) => !e.isFullyPlaceholder).length;
  const metricsMissingSource = entries.filter((e) => e.primarySource === null).length;
  const averageCompletionPercent = totalMetrics
    ? Math.round(entries.reduce((sum, e) => sum + e.completionPercent, 0) / totalMetrics)
    : 0;

  return {
    entries,
    summary: {
      totalMetrics,
      metricsWithAnyRealData,
      metricsFullyPlaceholder: totalMetrics - metricsWithAnyRealData,
      metricsMissingSource,
      averageCompletionPercent,
    },
  };
}
