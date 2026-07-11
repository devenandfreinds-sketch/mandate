import type { Prisma } from "@prisma/client";
import { prisma } from "../db.js";
import { mapRows, type JurisdictionLookup, type MetricLookup } from "./mapper.js";
import type { ImportSummary, RowOutcome, RunImportOptions, ValidatedRow } from "./types.js";

async function loadLookups(): Promise<{
  metricsBySlug: Map<string, MetricLookup>;
  jurisdictionsBySlug: Map<string, JurisdictionLookup>;
}> {
  const [metrics, jurisdictions] = await Promise.all([
    prisma.metricDefinition.findMany({ select: { id: true, slug: true, unit: true } }),
    prisma.jurisdiction.findMany({ select: { id: true, slug: true } }),
  ]);
  return {
    metricsBySlug: new Map(metrics.map((m) => [m.slug, m])),
    jurisdictionsBySlug: new Map(jurisdictions.map((j) => [j.slug, j])),
  };
}

async function writeValidatedRow(
  tx: Prisma.TransactionClient,
  row: ValidatedRow,
  options: RunImportOptions
): Promise<RowOutcome> {
  const where = {
    metricDefinitionId_jurisdictionId_periodType_periodStart: {
      metricDefinitionId: row.metricDefinitionId,
      jurisdictionId: row.jurisdictionId,
      periodType: row.periodType,
      periodStart: row.periodStart,
    },
  };

  const existing = await tx.metricValue.findUnique({ where });

  const data = {
    metricDefinitionId: row.metricDefinitionId,
    jurisdictionId: row.jurisdictionId,
    sourceId: options.sourceId,
    periodType: row.periodType,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    periodLabel: row.periodLabel,
    value: row.value,
    confidence: options.confidenceOverride ?? row.confidence,
    notes: row.notes,
    ingestionMethod: options.importType,
    dataQuality: options.dataQuality,
    isPlaceholder: options.dataQuality === "placeholder",
  };

  if (existing) {
    const previousValueJson = JSON.stringify({
      value: existing.value.toString(),
      sourceId: existing.sourceId,
      confidence: existing.confidence,
      notes: existing.notes,
      ingestionMethod: existing.ingestionMethod,
      dataQuality: existing.dataQuality,
      isPlaceholder: existing.isPlaceholder,
    });
    const updated = await tx.metricValue.update({ where: { id: existing.id }, data });
    return {
      rowNumber: row.rowNumber,
      status: "updated",
      message: "Updated existing value",
      previousValueJson,
      metricValueId: updated.id,
      rawData: row.rawData,
    };
  }

  const created = await tx.metricValue.create({ data });
  return {
    rowNumber: row.rowNumber,
    status: "created",
    metricValueId: created.id,
    rawData: row.rawData,
  };
}

export async function runImport(options: RunImportOptions): Promise<ImportSummary> {
  const { metricsBySlug, jurisdictionsBySlug } = await loadLookups();
  const { validated, errors } = mapRows(options.rawRows, options.mapping, metricsBySlug, jurisdictionsBySlug);

  const rejectedOutcomes: RowOutcome[] = errors.map((e) => ({
    rowNumber: e.rowNumber,
    status: "rejected",
    message: e.message,
    rawData: e.rawData,
  }));

  if (options.dryRun) {
    const previewOutcomes: RowOutcome[] = validated.map((row) => ({
      rowNumber: row.rowNumber,
      status: "created", // preview assumes create; the commit pass determines create vs update against live DB state
      rawData: row.rawData,
    }));
    return {
      totalRows: options.rawRows.length,
      validRows: validated.length,
      invalidRows: errors.length,
      createdCount: 0,
      updatedCount: 0,
      rows: [...previewOutcomes, ...rejectedOutcomes].sort((a, b) => a.rowNumber - b.rowNumber),
    };
  }

  const writtenOutcomes = await prisma.$transaction(async (tx) => {
    const outcomes: RowOutcome[] = [];
    for (const row of validated) {
      outcomes.push(await writeValidatedRow(tx, row, options));
    }

    const createdCount = outcomes.filter((o) => o.status === "created").length;
    const updatedCount = outcomes.filter((o) => o.status === "updated").length;

    const job = await tx.importJob.create({
      data: {
        filename: options.filename,
        importType: options.importType,
        categorySlug: options.categorySlug,
        status: "completed",
        totalRows: options.rawRows.length,
        validRows: validated.length,
        invalidRows: errors.length,
        createdCount,
        updatedCount,
        errorSummary: errors.length > 0 ? `${errors.length} row(s) rejected` : null,
        triggeredBy: options.triggeredBy,
        completedAt: new Date(),
        rows: {
          create: [...outcomes, ...rejectedOutcomes].map((o) => ({
            rowNumber: o.rowNumber,
            status: o.status,
            message: o.message,
            metricValueId: o.metricValueId,
            previousValueJson: o.previousValueJson,
            rawData: JSON.stringify(o.rawData),
          })),
        },
      },
      include: { rows: true },
    });

    return { job, outcomes: [...outcomes, ...rejectedOutcomes] };
  });

  return {
    importJobId: writtenOutcomes.job.id,
    totalRows: options.rawRows.length,
    validRows: validated.length,
    invalidRows: errors.length,
    createdCount: writtenOutcomes.job.createdCount,
    updatedCount: writtenOutcomes.job.updatedCount,
    rows: writtenOutcomes.outcomes.sort((a, b) => a.rowNumber - b.rowNumber),
  };
}
