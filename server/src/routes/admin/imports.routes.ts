import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ApiError } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { prisma } from "../../db.js";
import { parseCsv } from "../../import/csvParser.js";
import { parseJson } from "../../import/jsonParser.js";
import { runImport } from "../../import/importRunner.js";
import { rollbackImport } from "../../import/rollback.js";
import type { ImportMappingConfig, RawRow } from "../../import/types.js";

export const adminImportsRouter = Router();
adminImportsRouter.use(requireAdmin);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const DEFAULT_MAPPING: ImportMappingConfig = {
  columns: { jurisdiction: "jurisdiction", period: "year", value: "value", notes: "notes", confidence: "confidence" },
  periodType: "year",
};

function parseUploadedFile(filename: string, buffer: Buffer): RawRow[] {
  return filename.toLowerCase().endsWith(".json") ? parseJson(buffer) : parseCsv(buffer);
}

async function resolveSourceId(sourceArg: string): Promise<string> {
  const byId = await prisma.source.findUnique({ where: { id: sourceArg } });
  if (byId) return byId.id;
  const byName = await prisma.source.findUnique({ where: { name: sourceArg } });
  if (byName) return byName.id;
  throw ApiError.badRequest(`No Source found with id or name "${sourceArg}"`);
}

function runImportFromUpload(dryRun: boolean) {
  return asyncHandler(async (req, res) => {
    const file = (req as unknown as { file?: Express.Multer.File }).file;
    if (!file) throw ApiError.badRequest("No file uploaded (expected multipart field \"file\")");

    const { metric, source, quality, category } = req.body as Record<string, string | undefined>;
    if (!source) throw ApiError.badRequest("Missing \"source\" field (Source id or name)");

    const rawRows = parseUploadedFile(file.originalname, file.buffer);
    const sourceId = await resolveSourceId(source);
    const mapping: ImportMappingConfig = metric ? { ...DEFAULT_MAPPING, fixedMetricSlug: metric } : DEFAULT_MAPPING;

    const summary = await runImport({
      rawRows,
      mapping,
      sourceId,
      dataQuality: (quality as "official" | "estimated" | "placeholder") ?? "official",
      importType: file.originalname.toLowerCase().endsWith(".json") ? "json" : "csv",
      filename: file.originalname,
      categorySlug: category,
      triggeredBy: "admin",
      dryRun,
    });

    res.json({ data: summary });
  });
}

adminImportsRouter.post("/preview", upload.single("file"), runImportFromUpload(true));
adminImportsRouter.post("/", upload.single("file"), runImportFromUpload(false));

adminImportsRouter.post(
  "/api",
  asyncHandler(async (req, res) => {
    const { rows, metric, source, quality, category, filename } = req.body as {
      rows?: Array<Record<string, unknown>>;
      metric?: string;
      source?: string;
      quality?: string;
      category?: string;
      filename?: string;
    };
    if (!Array.isArray(rows) || rows.length === 0) throw ApiError.badRequest("Body must include a non-empty \"rows\" array");
    if (!source) throw ApiError.badRequest("Missing \"source\" field (Source id or name)");

    const rawRows: RawRow[] = rows.map((data, i) => ({
      rowNumber: i + 1,
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    }));
    const sourceId = await resolveSourceId(source);
    const mapping: ImportMappingConfig = metric ? { ...DEFAULT_MAPPING, fixedMetricSlug: metric } : DEFAULT_MAPPING;

    const summary = await runImport({
      rawRows,
      mapping,
      sourceId,
      dataQuality: (quality as "official" | "estimated" | "placeholder") ?? "official",
      importType: "api",
      filename: filename ?? "api-ingestion",
      categorySlug: category,
      triggeredBy: "admin:api",
      dryRun: false,
    });

    res.json({ data: summary });
  })
);

adminImportsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const jobs = await prisma.importJob.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    res.json({ data: jobs });
  })
);

adminImportsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const job = await prisma.importJob.findUnique({ where: { id: req.params.id }, include: { rows: true } });
    if (!job) throw ApiError.notFound(`Import job "${req.params.id}" not found`);
    res.json({ data: { ...job, rows: job.rows.map((r) => ({ ...r, rawData: JSON.parse(r.rawData) })) } });
  })
);

adminImportsRouter.post(
  "/:id/rollback",
  asyncHandler(async (req, res) => {
    const job = await rollbackImport(req.params.id);
    res.json({ data: job });
  })
);

