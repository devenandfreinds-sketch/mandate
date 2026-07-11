import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import type { Source } from "@mandate/shared";

export function mapSource(row: {
  id: string;
  name: string;
  publisher: string | null;
  url: string | null;
  sourceType: string;
  citation: string | null;
  retrievedAt: Date | null;
  isPlaceholder: boolean;
  publicationDate: Date | null;
  updateFrequency: string | null;
  methodology: string | null;
  defaultConfidence: string | null;
}): Source {
  return {
    id: row.id,
    name: row.name,
    publisher: row.publisher,
    url: row.url,
    sourceType: row.sourceType,
    citation: row.citation,
    retrievedAt: toIso(row.retrievedAt),
    isPlaceholder: row.isPlaceholder,
    publicationDate: toIso(row.publicationDate),
    updateFrequency: row.updateFrequency,
    methodology: row.methodology,
    defaultConfidence: row.defaultConfidence,
  };
}

export async function listSources(): Promise<Source[]> {
  const rows = await prisma.source.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapSource);
}

export async function getSourceById(id: string): Promise<Source | null> {
  const row = await prisma.source.findUnique({ where: { id } });
  return row ? mapSource(row) : null;
}
