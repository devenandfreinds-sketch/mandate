import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import type { GovernanceModelDetail, GovernanceModelSummary, PipelineSummary, TimelineEvent } from "@mandate/shared";

function mapTimelineEvent(e: {
  id: string;
  governanceModelId: string | null;
  jurisdictionId: string | null;
  administrationId: string | null;
  eventDate: Date;
  title: string;
  description: string;
  eventType: string;
  sourceId: string | null;
  isPlaceholder: boolean;
}): TimelineEvent {
  return {
    id: e.id,
    governanceModelId: e.governanceModelId,
    jurisdictionId: e.jurisdictionId,
    administrationId: e.administrationId,
    eventDate: toIso(e.eventDate),
    title: e.title,
    description: e.description,
    eventType: e.eventType,
    sourceId: e.sourceId,
    isPlaceholder: e.isPlaceholder,
  };
}

export async function listGovernanceModels(): Promise<GovernanceModelSummary[]> {
  const rows = await prisma.governanceModel.findMany({
    include: { _count: { select: { jurisdictions: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortName: r.shortName,
    summary: r.summary,
    colorHex: r.colorHex,
    jurisdictionCount: r._count.jurisdictions,
    isPlaceholder: r.isPlaceholder,
  }));
}

export async function getGovernanceModelBySlug(slug: string): Promise<GovernanceModelDetail | null> {
  const row = await prisma.governanceModel.findUnique({
    where: { slug },
    include: {
      _count: { select: { jurisdictions: true } },
      corePriorities: { orderBy: { sortOrder: "asc" } },
      jurisdictions: { orderBy: { name: "asc" } },
      timelineEvents: { orderBy: { eventDate: "asc" } },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    summary: row.summary,
    colorHex: row.colorHex,
    jurisdictionCount: row._count.jurisdictions,
    isPlaceholder: row.isPlaceholder,
    overview: row.overview,
    history: row.history,
    politicalContext: row.politicalContext,
    foundedYear: row.foundedYear,
    corePriorities: row.corePriorities.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      sortOrder: p.sortOrder,
      isPlaceholder: p.isPlaceholder,
    })),
    jurisdictions: row.jurisdictions.map((j) => ({
      id: j.id,
      slug: j.slug,
      name: j.name,
      kind: j.kind,
      stateOrRegion: j.stateOrRegion,
      country: j.country,
      population: j.population,
      populationYear: j.populationYear,
      governanceModelSlug: row.slug,
      governanceModelName: row.name,
      summary: j.summary,
      isPlaceholder: j.isPlaceholder,
    })),
    timelineEvents: row.timelineEvents.map(mapTimelineEvent),
  };
}

export async function getPipelineSummary(slug: string): Promise<PipelineSummary | null> {
  const governanceModel = await prisma.governanceModel.findUnique({ where: { slug }, select: { id: true } });
  if (!governanceModel) return null;

  const assessments = await prisma.pipelineAssessment.findMany({
    where: { isCurrent: true, jurisdiction: { governanceModelId: governanceModel.id } },
    include: { policyArea: { include: { category: { select: { slug: true, name: true } } } } },
  });

  const overallAvg = assessments.length
    ? assessments.reduce((sum, a) => sum + a.stage, 0) / assessments.length
    : 0;

  const byCategoryMap = new Map<string, { categoryName: string; total: number; count: number }>();
  for (const a of assessments) {
    const category = a.policyArea.category;
    if (!category) continue;
    const entry = byCategoryMap.get(category.slug) ?? { categoryName: category.name, total: 0, count: 0 };
    entry.total += a.stage;
    entry.count += 1;
    byCategoryMap.set(category.slug, entry);
  }

  return {
    governanceModelSlug: slug,
    averageStage: Number(overallAvg.toFixed(2)),
    policyAreaCount: assessments.length,
    byCategory: Array.from(byCategoryMap.entries()).map(([categorySlug, v]) => ({
      categorySlug,
      categoryName: v.categoryName,
      averageStage: Number((v.total / v.count).toFixed(2)),
    })),
  };
}
