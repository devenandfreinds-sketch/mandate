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

/** Full-row snapshot for the "created" case, where rollback deletes the row entirely and undo has to recreate it from scratch. */
interface FullRowSnapshot {
  metricDefinitionId: string;
  jurisdictionId: string;
  administrationId: string | null;
  sourceId: string;
  periodType: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  value: string;
  confidence: string | null;
  notes: string | null;
  ingestionMethod: string;
  dataQuality: string;
  isPlaceholder: boolean;
}

/**
 * Rolls an import back. Before overwriting or deleting anything, captures a `restoreValueJson`
 * snapshot of exactly what's about to be lost (the post-import state for an "updated" row, or the
 * full row for a "created" row about to be deleted) — this is what makes undoRollback() below
 * possible. A rollback can be undone, then rolled back again, any number of times; each rollback
 * re-captures a fresh restore snapshot, so the toggle stays correct.
 */
export async function rollbackImport(importJobId: string) {
  const job = await prisma.importJob.findUnique({ where: { id: importJobId }, include: { rows: true } });
  if (!job) throw ApiError.notFound(`Import job "${importJobId}" not found`);
  if (job.status === "rolled_back") throw ApiError.badRequest("This import has already been rolled back");

  await prisma.$transaction(async (tx) => {
    for (const row of job.rows) {
      if (row.status === "created" && row.metricValueId) {
        const current = await tx.metricValue.findUnique({ where: { id: row.metricValueId } });
        if (current) {
          const snapshot: FullRowSnapshot = {
            metricDefinitionId: current.metricDefinitionId,
            jurisdictionId: current.jurisdictionId,
            administrationId: current.administrationId,
            sourceId: current.sourceId,
            periodType: current.periodType,
            periodStart: current.periodStart.toISOString(),
            periodEnd: current.periodEnd.toISOString(),
            periodLabel: current.periodLabel,
            value: current.value.toString(),
            confidence: current.confidence,
            notes: current.notes,
            ingestionMethod: current.ingestionMethod,
            dataQuality: current.dataQuality,
            isPlaceholder: current.isPlaceholder,
          };
          await tx.importRowResult.update({ where: { id: row.id }, data: { restoreValueJson: JSON.stringify(snapshot) } });
          await tx.metricValue.delete({ where: { id: row.metricValueId } }).catch(() => undefined);
        }
      } else if (row.status === "updated" && row.metricValueId && row.previousValueJson) {
        const current = await tx.metricValue.findUnique({ where: { id: row.metricValueId } });
        if (current) {
          const restoreSnapshot: PreviousValueSnapshot = {
            value: current.value.toString(),
            sourceId: current.sourceId,
            confidence: current.confidence,
            notes: current.notes,
            ingestionMethod: current.ingestionMethod,
            dataQuality: current.dataQuality,
            isPlaceholder: current.isPlaceholder,
          };
          await tx.importRowResult.update({ where: { id: row.id }, data: { restoreValueJson: JSON.stringify(restoreSnapshot) } });
        }

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

/**
 * Undoes a rollback — puts the import's effects back exactly as they were right before the
 * rollback ran, using the restoreValueJson snapshot captured at rollback time. Marks the job
 * "completed" again (with restoredAt set) so it can be rolled back again later if needed.
 */
export async function undoRollback(importJobId: string) {
  const job = await prisma.importJob.findUnique({ where: { id: importJobId }, include: { rows: true } });
  if (!job) throw ApiError.notFound(`Import job "${importJobId}" not found`);
  if (job.status !== "rolled_back") throw ApiError.badRequest("This import has not been rolled back, so there is nothing to undo");

  await prisma.$transaction(async (tx) => {
    for (const row of job.rows) {
      if (!row.restoreValueJson) continue;

      if (row.status === "created") {
        const snapshot = JSON.parse(row.restoreValueJson) as FullRowSnapshot;
        const recreated = await tx.metricValue.create({
          data: {
            metricDefinitionId: snapshot.metricDefinitionId,
            jurisdictionId: snapshot.jurisdictionId,
            administrationId: snapshot.administrationId,
            sourceId: snapshot.sourceId,
            periodType: snapshot.periodType,
            periodStart: new Date(snapshot.periodStart),
            periodEnd: new Date(snapshot.periodEnd),
            periodLabel: snapshot.periodLabel,
            value: snapshot.value,
            confidence: snapshot.confidence,
            notes: snapshot.notes,
            ingestionMethod: snapshot.ingestionMethod,
            dataQuality: snapshot.dataQuality,
            isPlaceholder: snapshot.isPlaceholder,
          },
        });
        await tx.importRowResult.update({ where: { id: row.id }, data: { metricValueId: recreated.id } });
      } else if (row.status === "updated" && row.metricValueId) {
        const snapshot = JSON.parse(row.restoreValueJson) as PreviousValueSnapshot;
        await tx.metricValue
          .update({
            where: { id: row.metricValueId },
            data: {
              value: snapshot.value,
              sourceId: snapshot.sourceId,
              confidence: snapshot.confidence,
              notes: snapshot.notes,
              ingestionMethod: snapshot.ingestionMethod,
              dataQuality: snapshot.dataQuality,
              isPlaceholder: snapshot.isPlaceholder,
            },
          })
          .catch(() => undefined);
      }
    }

    await tx.importJob.update({
      where: { id: importJobId },
      data: { status: "completed", restoredAt: new Date() },
    });
  });

  return prisma.importJob.findUniqueOrThrow({ where: { id: importJobId } });
}
