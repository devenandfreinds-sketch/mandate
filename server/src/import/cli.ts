import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { prisma } from "../db.js";
import { parseCsv } from "./csvParser.js";
import { parseJson } from "./jsonParser.js";
import { runImport } from "./importRunner.js";
import type { ImportMappingConfig, DataQuality } from "./types.js";
import { DATA_QUALITY_LEVEL_SLUGS } from "@mandate/shared";

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return args;
}

async function resolveSourceId(sourceArg: string): Promise<string> {
  const byId = await prisma.source.findUnique({ where: { id: sourceArg } });
  if (byId) return byId.id;
  const byName = await prisma.source.findUnique({ where: { name: sourceArg } });
  if (byName) return byName.id;
  throw new Error(`No Source found with id or name "${sourceArg}". Create it first (see /imports/sources/*.json).`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = args.file as string | undefined;
  if (!filePath) {
    console.error(
      "Usage: npm run import -w server -- --file <path.csv|.json> --source <sourceIdOrName> [--metric <slug>] [--mapping <mapping.json>] [--quality government|academic|alternative|estimated|unavailable|placeholder] [--category <slug>] [--period-type year|quarter|month|uk_fiscal_year|uk_academic_year] [--currency <ISO 4217 code, default USD>] [--dry-run]"
    );
    process.exit(1);
  }

  const dryRun = Boolean(args["dry-run"]);
  // No default: silently falling back to a legacy label ("official" was used before the current
  // 6-level vocabulary existed) is exactly how a new researcher would mislabel real source quality.
  // Require an explicit, current choice every time instead.
  const quality = args.quality as string | undefined;
  if (!quality) {
    console.error("Missing --quality <government|academic|alternative|estimated|unavailable|placeholder>");
    process.exit(1);
  }
  if (!DATA_QUALITY_LEVEL_SLUGS.includes(quality)) {
    console.error(`Invalid --quality "${quality}". Must be one of: ${DATA_QUALITY_LEVEL_SLUGS.join(", ")}`);
    process.exit(1);
  }
  const categorySlug = args.category as string | undefined;
  const sourceArg = args.source as string | undefined;
  if (!sourceArg) {
    console.error("Missing --source <sourceIdOrName>");
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), filePath);
  const ext = path.extname(absPath).toLowerCase();
  const buffer = readFileSync(absPath);
  const rawRows = ext === ".json" ? parseJson(buffer) : parseCsv(buffer);

  let mapping: ImportMappingConfig;
  if (args.mapping) {
    mapping = JSON.parse(readFileSync(path.resolve(process.cwd(), args.mapping as string), "utf-8"));
  } else {
    const periodType = (args["period-type"] as string | undefined) ?? "year";
    mapping = {
      columns: { jurisdiction: "jurisdiction", metric: args.metric ? undefined : "metric", period: "year", value: "value", notes: "notes", confidence: "confidence" },
      periodType: periodType as ImportMappingConfig["periodType"],
      fixedMetricSlug: args.metric as string | undefined,
    };
  }

  const sourceId = await resolveSourceId(sourceArg);

  const summary = await runImport({
    rawRows,
    mapping,
    sourceId,
    dataQuality: quality as DataQuality,
    currencyCode: args.currency as string | undefined,
    importType: ext === ".json" ? "json" : "csv",
    filename: path.basename(absPath),
    categorySlug,
    triggeredBy: "cli",
    dryRun,
  });

  console.log(`\n${dryRun ? "[DRY RUN] " : ""}Import summary for ${path.basename(absPath)}:`);
  console.log(`  Total rows:   ${summary.totalRows}`);
  console.log(`  Valid rows:   ${summary.validRows}`);
  console.log(`  Invalid rows: ${summary.invalidRows}`);
  if (!dryRun) {
    console.log(`  Created:      ${summary.createdCount}`);
    console.log(`  Updated:      ${summary.updatedCount}`);
    console.log(`  Import job:   ${summary.importJobId}`);
  }
  const rejected = summary.rows.filter((r) => r.status === "rejected");
  if (rejected.length > 0) {
    console.log(`\nRejected rows:`);
    for (const r of rejected) {
      console.log(`  Row ${r.rowNumber}: ${r.message}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
