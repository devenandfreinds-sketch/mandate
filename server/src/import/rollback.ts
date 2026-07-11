import { prisma } from "../db.js";
import { ApiError } from "../middleware/errorHandler.js";

interface PreviousValueSnapshot {
  value: string;
  sourceId: string;
  confidence: string | null;
  notes: string | null;
  ingestionMethod: string;
  dataQuality: string;
  isPlaceholder: boolean;
}

export async function rollbackImport(importJobId: string) {
  const job = await prisma.importJob.findUnique({ where: { id: importJobId }, include: { rows: true } });
  if (!job) throw ApiError.notFound(`Import job "${importJobId}" not found`);
  if (job.status === "rolled_back") throw ApiError.badRequest("This import has already been rolled back");

  await prisma.$transaction(async (tx) => {
    for (const row of job.rows) {
      if (row.status === "created" && row.metricValueId) {
        await tx.metricValue.delete({ where: { id: row.metricValueId } }).catch(() => undefined);
      } else if (row.status === "updated" && row.metricValueId && row.previousValueJson) {
        const previous = JSON.parse(row.previousValueJson) as PreviousValueSnapshot;
        await tx.metricValue
          .update({
            where: { id: row.metricValueId },
            data: {
              value: previous.value,
              sourceId: previous.sourceId,
              confidence: previous.confidence,
              notes: previous.notes,
              ingestionMethod: previous.ingestionMethod,
              dataQuality: previous.dataQuality,
              isPlaceholder: previous.isPlaceholder,
            },
          })
          .catch(() => undefined);
      }
    }

    await tx.importJob.update({
      where: { id: importJobId },
      data: { status: "rolled_back", rolledBackAt: new Date() },
    });
  });

  return prisma.importJob.findUniqueOrThrow({ where: { id: importJobId } });
}
