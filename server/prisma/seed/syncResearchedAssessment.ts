/**
 * Pushes a deliberate correction to one researched PipelineAssessment into an existing database.
 *
 * The main seed never updates a researched row once it exists (see [10b/11] in index.ts), so editing
 * evidenceSummary/limitations or adding an evidence link in a *ResearchedPipeline.ts file has no effect
 * on a database that was already seeded. This script closes that gap for one row at a time: it
 * overwrites evidenceSummary and limitations from the seed file, and adds any evidence links whose URL
 * is not already attached. It never touches stage, dataQuality, dates, or existing evidence links.
 *
 * Usage (from server/):
 *   npx tsx prisma/seed/syncResearchedAssessment.ts <jurisdictionSlug> <policyAreaSlug> <assessmentDate> [institutionName]
 * Against production, prefix with `railway run --service server --`.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { sources } from "./data/sources.js";
import { chicagoResearchedPipelineAssessments } from "./data/chicagoResearchedPipeline.js";
import { greaterManchesterResearchedPipelineAssessments } from "./data/greaterManchesterResearchedPipeline.js";
import { newYorkCityResearchedPipelineAssessments } from "./data/newYorkCityResearchedPipeline.js";
import { seattleResearchedPipelineAssessments } from "./data/seattleResearchedPipeline.js";
import { minneapolisResearchedPipelineAssessments } from "./data/minneapolisResearchedPipeline.js";
import { washingtonDcResearchedPipelineAssessments } from "./data/washingtonDcResearchedPipeline.js";
import { durhamResearchedPipelineAssessments } from "./data/durhamResearchedPipeline.js";

const [jurisdictionSlug, policyAreaSlug, assessmentDateArg, institutionArg] = process.argv.slice(2);
if (!jurisdictionSlug || !policyAreaSlug || !assessmentDateArg) {
  console.error(
    "Usage: npx tsx prisma/seed/syncResearchedAssessment.ts <jurisdictionSlug> <policyAreaSlug> <assessmentDate> [institutionName]"
  );
  process.exit(1);
}
const institutionName = institutionArg ?? "";

const spec = [
  ...chicagoResearchedPipelineAssessments,
  ...greaterManchesterResearchedPipelineAssessments,
  ...newYorkCityResearchedPipelineAssessments,
  ...seattleResearchedPipelineAssessments,
  ...minneapolisResearchedPipelineAssessments,
  ...washingtonDcResearchedPipelineAssessments,
  ...durhamResearchedPipelineAssessments,
].find(
  (r) =>
    r.jurisdictionSlug === jurisdictionSlug &&
    r.policyAreaSlug === policyAreaSlug &&
    r.assessmentDate === assessmentDateArg &&
    (r.institutionName ?? "") === institutionName
);
if (!spec) {
  console.error("No matching assessment in the seed data files.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const row = await prisma.pipelineAssessment.findFirst({
    where: {
      jurisdiction: { slug: jurisdictionSlug },
      policyArea: { slug: policyAreaSlug },
      institutionName,
      assessmentDate: new Date(assessmentDateArg),
    },
    include: { evidenceLinks: { select: { url: true } } },
  });
  if (!row) throw new Error("No matching PipelineAssessment row in the database. Run the seed first.");

  await prisma.pipelineAssessment.update({
    where: { id: row.id },
    data: { evidenceSummary: spec!.evidenceSummary, limitations: spec!.limitations },
  });

  const existingUrls = new Set(row.evidenceLinks.map((l) => l.url));
  let added = 0;
  for (const link of spec!.evidenceLinks) {
    if (existingUrls.has(link.url)) continue;
    const sourceName = link.sourceKey ? sources.find((s) => s.key === link.sourceKey)?.name : undefined;
    const source = sourceName ? await prisma.source.findUnique({ where: { name: sourceName } }) : null;
    await prisma.evidenceLink.create({
      data: {
        pipelineAssessmentId: row.id,
        label: link.label,
        description: link.description,
        url: link.url,
        evidenceType: link.evidenceType,
        publicationDate: link.publicationDate ? new Date(link.publicationDate) : null,
        publisher: link.publisher,
        sourceTier: link.sourceTier,
        sourceId: source?.id ?? null,
        isPlaceholder: false,
      },
    });
    added++;
  }
  console.log(`Updated assessment ${row.id}: text synced, ${added} evidence link(s) added.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
