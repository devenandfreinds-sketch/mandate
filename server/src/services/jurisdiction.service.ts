import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import type {
  AdministrationDetail,
  AdministrationSummary,
  JurisdictionDetail,
  JurisdictionSummary,
  TimelineEvent,
} from "@mandate/shared";

function isCurrentAdministration(endDate: Date | null): boolean {
  return endDate === null;
}

function mapAdministration(a: {
  id: string;
  jurisdictionId: string;
  leaderName: string;
  leaderTitle: string;
  politicalParty: string | null;
  coalitionDescription: string | null;
  termNumber: number | null;
  startDate: Date;
  endDate: Date | null;
  photoUrl: string | null;
  isPlaceholder: boolean;
}): AdministrationSummary {
  return {
    id: a.id,
    jurisdictionId: a.jurisdictionId,
    leaderName: a.leaderName,
    leaderTitle: a.leaderTitle,
    politicalParty: a.politicalParty,
    coalitionDescription: a.coalitionDescription,
    termNumber: a.termNumber,
    startDate: toIso(a.startDate),
    endDate: toIso(a.endDate),
    photoUrl: a.photoUrl,
    isCurrent: isCurrentAdministration(a.endDate),
    isPlaceholder: a.isPlaceholder,
  };
}

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

function mapJurisdictionSummary(j: {
  id: string;
  slug: string;
  name: string;
  kind: string;
  stateOrRegion: string | null;
  country: string;
  population: number | null;
  populationYear: number | null;
  summary: string;
  isPlaceholder: boolean;
  governanceModel: { slug: string; name: string };
}): JurisdictionSummary {
  return {
    id: j.id,
    slug: j.slug,
    name: j.name,
    kind: j.kind,
    stateOrRegion: j.stateOrRegion,
    country: j.country,
    population: j.population,
    populationYear: j.populationYear,
    governanceModelSlug: j.governanceModel.slug,
    governanceModelName: j.governanceModel.name,
    summary: j.summary,
    isPlaceholder: j.isPlaceholder,
  };
}

export async function listJurisdictions(governanceModelSlug?: string): Promise<JurisdictionSummary[]> {
  const rows = await prisma.jurisdiction.findMany({
    where: governanceModelSlug ? { governanceModel: { slug: governanceModelSlug } } : undefined,
    include: { governanceModel: { select: { slug: true, name: true } } },
    orderBy: { name: "asc" },
  });
  return rows.map(mapJurisdictionSummary);
}

export async function getJurisdictionBySlug(slug: string): Promise<JurisdictionDetail | null> {
  const row = await prisma.jurisdiction.findUnique({
    where: { slug },
    include: {
      governanceModel: { select: { slug: true, name: true } },
      administrations: { orderBy: { startDate: "asc" } },
      timelineEvents: { orderBy: { eventDate: "asc" } },
    },
  });
  if (!row) return null;

  const administrations = row.administrations.map(mapAdministration);
  const current = administrations.find((a) => a.isCurrent) ?? administrations[administrations.length - 1] ?? null;

  return {
    ...mapJurisdictionSummary(row),
    latitude: row.latitude,
    longitude: row.longitude,
    description: row.description,
    administrations,
    currentAdministration: current,
    timelineEvents: row.timelineEvents.map(mapTimelineEvent),
  };
}

export async function getAdministrations(jurisdictionSlug: string): Promise<AdministrationSummary[] | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true } });
  if (!jurisdiction) return null;
  const rows = await prisma.administration.findMany({
    where: { jurisdictionId: jurisdiction.id },
    orderBy: { startDate: "asc" },
  });
  return rows.map(mapAdministration);
}

export async function getAdministrationDetail(
  jurisdictionSlug: string,
  administrationId: string
): Promise<AdministrationDetail | null> {
  const jurisdiction = await prisma.jurisdiction.findUnique({ where: { slug: jurisdictionSlug }, select: { id: true } });
  if (!jurisdiction) return null;

  const row = await prisma.administration.findFirst({
    where: { id: administrationId, jurisdictionId: jurisdiction.id },
    include: { campaignPromises: { include: { category: { select: { slug: true } } } } },
  });
  if (!row) return null;

  return {
    ...mapAdministration(row),
    campaignPromises: row.campaignPromises.map((cp) => ({
      id: cp.id,
      administrationId: cp.administrationId,
      categoryId: cp.categoryId,
      categorySlug: cp.category?.slug ?? null,
      title: cp.title,
      description: cp.description,
      status: cp.status,
      datePromised: toIso(cp.datePromised),
      isPlaceholder: cp.isPlaceholder,
    })),
  };
}
