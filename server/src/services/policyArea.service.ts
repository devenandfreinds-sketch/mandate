import { prisma } from "../db.js";
import type { PolicyArea } from "@mandate/shared";

export async function listPolicyAreas(): Promise<PolicyArea[]> {
  const rows = await prisma.policyArea.findMany({
    include: { category: { select: { slug: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    categoryId: r.categoryId,
    categorySlug: r.category?.slug ?? null,
    slug: r.slug,
    name: r.name,
    description: r.description,
    sortOrder: r.sortOrder,
    isPlaceholder: r.isPlaceholder,
  }));
}
