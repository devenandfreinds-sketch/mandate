import { prisma } from "../db.js";
import { toIso, toNumber } from "../utils/serialize.js";
import { mapSource } from "./source.service.js";
import type {
  Category,
  CategoryWithMetricDefinitions,
  DashboardSummary,
  MetricDefinition,
  MetricDefinitionDetail,
  MetricSeries,
  MetricValue,
} from "@mandate/shared";

export interface JurisdictionMetricsFilter {
  categorySlug?: string;
  metricSlugs?: string[];
  administrationId?: string;
  from?: Date;
  to?: Date;
  periodType?: string;
}

function mapCategory(c: { id: string; slug: string; name: string; description: string; icon: string | null; colorHex: string | null; sortOrder: number }): Category {
  return { id: c.id, slug: c.slug, name: c.name, description: c.description, icon: c.icon, colorHex: c.colorHex, sortOrder: c.sortOrder };
}

function mapMetricDefinition(m: {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
  decimalPrecision: number;
  sortOrder: number;
  isPlaceholder: boolean;
  category: { slug: string };
}): MetricDefinition {
  return {
    id: m.id,
    categoryId: m.categoryId,
    categorySlug: m.category.slug,
    slug: m.slug,
    name: m.name,
    description: m.description,
    unit: m.unit,
    higherIsBetter: m.higherIsBetter,
    decimalPrecision: m.decimalPrecision,
    sortOrder: m.sortOrder,
    isPlaceholder: m.isPlaceholder,
  };
}

export async function listCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(mapCategory);
}

export async function getCategoryWithMetricDefinitions(slug: string): Promise<CategoryWithMetricDefinitions | null> {
  const row = await prisma.category.findUnique({
    where: { slug },
    include: { metricDefinitions: { include: { category: { select: { slug: true } } }, orderBy: { sortOrder: "asc" } } },
  });
  if (!row) return null;
  return { ...mapCategory(row), metricDefinitions: row.metricDefinitions.map(mapMetricDefinition) };
}

export async function listMetricDefinitions(categorySlug?: string): Promise<MetricDefinition[]> {
  const rows = await prisma.metricDefinition.findMany({
    where: categorySlug ? { category: { slug: categorySlug } } : undefined,
    include: { category: { select: { slug: true } } },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });
  return rows.map(mapMetricDefinition);
}

export async function getMetricDefinitionDetail(slug: string): Promise<MetricDefinitionDetail | null> {
  const row = await prisma.metricDefinition.findUnique({
    where: { slug },
    include: { category: { select: { slug: true } }, primarySource: true },
  });
  if (!row) return null;

  const values = await prisma.metricValue.findMany({
    where: { metricDefinitionId: row.id },
    select: { jurisdictionId: true, periodStart: true, periodEnd: true, updatedAt: true, dataQuality: true },
  });

  const jurisdictionIds = new Set(values.map((v) => v.jurisdictionId));
  const dataQualityBreakdown: Record<string, number> = {};
  for (const v of values) {
    dataQualityBreakdown[v.dataQuality] = (dataQualityBreakdown[v.dataQuality] ?? 0) + 1;
  }
  const periodStarts = values.map((v) => v.periodStart.getTime());
  const periodEnds = values.map((v) => v.periodEnd.getTime());
  const updatedTimes = values.map((v) => v.updatedAt.getTime());

  return {
    ...mapMetricDefinition(row),
    calculationMethod: row.calculationMethod,
    coverageNote: row.coverageNote,
    limitations: row.limitations,
    primarySource: row.primarySource ? mapSource(row.primarySource) : null,
    lastUpdated: updatedTimes.length ? new Date(Math.max(...updatedTimes)).toISOString() : null,
    coverage: {
      jurisdictionCount: jurisdictionIds.size,
      periodStart: periodStarts.length ? new Date(Math.min(...periodStarts)).toISOString() : null,
      periodEnd: periodEnds.length ? new Date(Math.max(...periodEnds)).toISOString() : null,
      valueCount: values.length,
      dataQualityBreakdown,
    },
  };
}

export async function getJurisdictionMetrics(
  jurisdictionSlug: string,
  filter: JurisdictionMetricsFilter
): Promise<MetricSeries[] | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true, name: true } });
  if (!jurisdiction) return null;

  const metricDefs = await prisma.metricDefinition.findMany({
    where: {
      ...(filter.categorySlug ? { category: { slug: filter.categorySlug } } : {}),
      ...(filter.metricSlugs?.length ? { slug: { in: filter.metricSlugs } } : {}),
    },
    include: { category: { select: { slug: true } } },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });
  if (metricDefs.length === 0) return [];

  const values = await prisma.metricValue.findMany({
    where: {
      jurisdictionId: jurisdiction.id,
      metricDefinitionId: { in: metricDefs.map((m) => m.id) },
      ...(filter.administrationId ? { administrationId: filter.administrationId } : {}),
      ...(filter.periodType ? { periodType: filter.periodType } : {}),
      ...(filter.from || filter.to
        ? {
            periodStart: {
              ...(filter.from ? { gte: filter.from } : {}),
              ...(filter.to ? { lte: filter.to } : {}),
            },
          }
        : {}),
    },
    orderBy: { periodStart: "asc" },
  });

  const valuesByMetricId = new Map<string, typeof values>();
  for (const v of values) {
    const list = valuesByMetricId.get(v.metricDefinitionId) ?? [];
    list.push(v);
    valuesByMetricId.set(v.metricDefinitionId, list);
  }

  return metricDefs.map((def) => ({
    metricDefinition: mapMetricDefinition(def),
    jurisdictionSlug,
    jurisdictionName: jurisdiction.name,
    values: (valuesByMetricId.get(def.id) ?? []).map((v) => mapMetricValue(v, def.slug, jurisdictionSlug)),
  }));
}

export async function getMetricValuesAcrossJurisdictions(
  metricSlug: string,
  jurisdictionSlugs: string[],
  from?: Date,
  to?: Date
): Promise<MetricSeries[] | null> {
  const metricDef = await prisma.metricDefinition.findUnique({
    where: { slug: metricSlug },
    include: { category: { select: { slug: true } } },
  });
  if (!metricDef) return null;

  const jurisdictions = await prisma.jurisdiction.findMany({
    where: jurisdictionSlugs.length ? { slug: { in: jurisdictionSlugs } } : undefined,
    select: { id: true, slug: true, name: true },
  });

  const values = await prisma.metricValue.findMany({
    where: {
      metricDefinitionId: metricDef.id,
      jurisdictionId: { in: jurisdictions.map((j) => j.id) },
      ...(from || to
        ? { periodStart: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
        : {}),
    },
    orderBy: { periodStart: "asc" },
  });

  return jurisdictions.map((j) => ({
    metricDefinition: mapMetricDefinition(metricDef),
    jurisdictionSlug: j.slug,
    jurisdictionName: j.name,
    values: values.filter((v) => v.jurisdictionId === j.id).map((v) => mapMetricValue(v, metricDef.slug, j.slug)),
  }));
}

function mapMetricValue(
  v: {
    id: string;
    metricDefinitionId: string;
    jurisdictionId: string;
    administrationId: string | null;
    sourceId: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    periodLabel: string;
    value: unknown;
    currencyCode: string;
    confidence: string | null;
    notes: string | null;
    ingestionMethod: string;
    dataQuality: string;
    isPlaceholder: boolean;
    researchedById?: string | null;
    reviewedById?: string | null;
    reviewedAt?: Date | null;
    methodologyVersion?: string | null;
    nextReviewDate?: Date | null;
  },
  metricSlug: string,
  jurisdictionSlug: string
): MetricValue {
  return {
    id: v.id,
    metricDefinitionId: v.metricDefinitionId,
    metricSlug,
    jurisdictionId: v.jurisdictionId,
    jurisdictionSlug,
    administrationId: v.administrationId,
    sourceId: v.sourceId,
    periodType: v.periodType,
    periodStart: toIso(v.periodStart),
    periodEnd: toIso(v.periodEnd),
    periodLabel: v.periodLabel,
    value: toNumber(v.value as never),
    currencyCode: v.currencyCode,
    confidence: v.confidence,
    notes: v.notes,
    ingestionMethod: v.ingestionMethod,
    dataQuality: v.dataQuality,
    isPlaceholder: v.isPlaceholder,
    researchedById: v.researchedById ?? null,
    reviewedById: v.reviewedById ?? null,
    reviewedAt: v.reviewedAt ? toIso(v.reviewedAt) : null,
    methodologyVersion: v.methodologyVersion ?? null,
    nextReviewDate: v.nextReviewDate ? toIso(v.nextReviewDate) : null,
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [governanceModelCount, jurisdictionCount, metricDefinitionCount, metricValueCount, categories, jurisdictions] =
    await Promise.all([
      prisma.governanceModel.count(),
      prisma.jurisdiction.count(),
      prisma.metricDefinition.count(),
      prisma.metricValue.count(),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.jurisdiction.findMany({ include: { governanceModel: { select: { slug: true } } } }),
    ]);

  const headlineMetrics = await Promise.all(
    categories.map(async (category) => {
      const headlineDef = await prisma.metricDefinition.findFirst({
        where: { categoryId: category.id },
        orderBy: { sortOrder: "asc" },
      });
      if (!headlineDef) return null;

      const values = await prisma.metricValue.findMany({
        where: { metricDefinitionId: headlineDef.id },
        orderBy: { periodStart: "desc" },
      });

      const latestByJurisdiction = new Map<string, (typeof values)[number]>();
      for (const v of values) {
        if (!latestByJurisdiction.has(v.jurisdictionId)) latestByJurisdiction.set(v.jurisdictionId, v);
      }

      return {
        categorySlug: category.slug,
        categoryName: category.name,
        metricSlug: headlineDef.slug,
        metricName: headlineDef.name,
        unit: headlineDef.unit,
        higherIsBetter: headlineDef.higherIsBetter,
        byJurisdiction: jurisdictions.map((j) => {
          const latest = latestByJurisdiction.get(j.id);
          return {
            jurisdictionSlug: j.slug,
            jurisdictionName: j.name,
            governanceModelSlug: j.governanceModel.slug,
            latestValue: latest ? toNumber(latest.value as never) : null,
            latestPeriodLabel: latest?.periodLabel ?? null,
            dataQuality: latest?.dataQuality ?? "placeholder",
            isPlaceholder: latest?.isPlaceholder ?? true,
          };
        }),
      };
    })
  );

  return {
    governanceModelCount,
    jurisdictionCount,
    metricDefinitionCount,
    metricValueCount,
    headlineMetrics: headlineMetrics.filter((m): m is NonNullable<typeof m> => m !== null),
  };
}
