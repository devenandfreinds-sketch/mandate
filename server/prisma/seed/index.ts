import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { sources } from "./data/sources.js";
import { categories } from "./data/categories.js";
import { housingMetrics } from "./data/metricDefinitions/housing.js";
import { innovationMetrics } from "./data/metricDefinitions/innovation.js";
import { workforceMetrics } from "./data/metricDefinitions/workforce.js";
import { governmentCapacityMetrics } from "./data/metricDefinitions/governmentCapacity.js";
import { transitMetrics } from "./data/metricDefinitions/transit.js";
import { publicSafetyMetrics } from "./data/metricDefinitions/publicSafety.js";
import { fiscalHealthMetrics } from "./data/metricDefinitions/fiscalHealth.js";
import { governanceModels } from "./data/governanceModels.js";
import { jurisdictions } from "./data/jurisdictions.js";
import { administrations } from "./data/administrations.js";
import { campaignPromises } from "./data/campaignPromises.js";
import { timelineEvents } from "./data/timelineEvents.js";
import { policyAreas } from "./data/policyAreas.js";
import { metricSourceAssignments } from "./data/metricSourceAssignments.js";
import { unavailableMetrics } from "./data/unavailableMetrics.js";
import { chicagoResearchedPipelineAssessments } from "./data/chicagoResearchedPipeline.js";
import { researchQueueSeed } from "./data/researchQueue.js";
import { generateAnnualSeries, type MetricSeedSpec, type AdministrationWindow } from "./generators/timeSeries.js";
import { generatePipelineAssessment } from "./generators/pipelineAssessment.js";

const prisma = new PrismaClient();

const metricsByCategory: Record<string, MetricSeedSpec[]> = {
  housing: housingMetrics,
  innovation: innovationMetrics,
  workforce: workforceMetrics,
  "government-capacity": governmentCapacityMetrics,
  transit: transitMetrics,
  "public-safety": publicSafetyMetrics,
  "fiscal-health": fiscalHealthMetrics,
};

function assertSafeToRun() {
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.SEED_CONFIRM === "yes") return;

  console.error(
    "\n✖ Refusing to run against a production environment (NODE_ENV=production) without confirmation.\n\n" +
      "This is safe to run on an empty or placeholder-only database — reference data (sources,\n" +
      "categories, metric definitions, governance models, jurisdictions) is upserted, and only\n" +
      "placeholder metric values are regenerated. Real imported observations (dataQuality\n" +
      "official/estimated) are never touched.\n\n" +
      "If you intend to run this now, re-run with SEED_CONFIRM=yes, e.g.:\n" +
      "  SEED_CONFIRM=yes npm run db:seed -w server\n"
  );
  process.exit(1);
}

async function main() {
  assertSafeToRun();

  console.log("[1/11] Seeding sources...");
  const sourceIdByKey = new Map<string, string>();
  for (const s of sources) {
    const row = await prisma.source.upsert({
      where: { name: s.name },
      update: {
        publisher: s.publisher,
        url: s.url,
        sourceType: s.sourceType,
        citation: s.citation,
        isPlaceholder: s.isPlaceholder,
        publicationDate: s.publicationDate ? new Date(s.publicationDate) : null,
        updateFrequency: s.updateFrequency ?? null,
        methodology: s.methodology ?? null,
        defaultConfidence: s.defaultConfidence ?? null,
      },
      create: {
        name: s.name,
        publisher: s.publisher,
        url: s.url,
        sourceType: s.sourceType,
        citation: s.citation,
        isPlaceholder: s.isPlaceholder,
        publicationDate: s.publicationDate ? new Date(s.publicationDate) : null,
        updateFrequency: s.updateFrequency ?? null,
        methodology: s.methodology ?? null,
        defaultConfidence: s.defaultConfidence ?? null,
      },
    });
    sourceIdByKey.set(s.key, row.id);
  }
  const placeholderSourceId = sourceIdByKey.get("placeholder_generator")!;

  console.log("[2/11] Seeding categories...");
  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, icon: c.icon, colorHex: c.colorHex, sortOrder: c.sortOrder },
      create: c,
    });
    categoryIdBySlug.set(c.slug, row.id);
  }

  console.log("[3/11] Seeding metric definitions...");
  const metricDefIdBySlug = new Map<string, string>();
  for (const [categorySlug, specs] of Object.entries(metricsByCategory)) {
    const categoryId = categoryIdBySlug.get(categorySlug)!;
    for (const spec of specs) {
      const row = await prisma.metricDefinition.upsert({
        where: { slug: spec.slug },
        update: {
          categoryId,
          name: spec.name,
          description: spec.description,
          unit: spec.unit,
          higherIsBetter: spec.higherIsBetter,
          decimalPrecision: spec.decimalPrecision,
          sortOrder: spec.sortOrder,
        },
        create: {
          categoryId,
          slug: spec.slug,
          name: spec.name,
          description: spec.description,
          unit: spec.unit,
          higherIsBetter: spec.higherIsBetter,
          decimalPrecision: spec.decimalPrecision,
          sortOrder: spec.sortOrder,
          isPlaceholder: true,
        },
      });
      metricDefIdBySlug.set(spec.slug, row.id);
    }
  }

  console.log("[3b/11] Assigning primary sources + methodology to metric definitions...");
  for (const assignment of metricSourceAssignments) {
    const metricDefinitionId = metricDefIdBySlug.get(assignment.metricSlug);
    if (!metricDefinitionId) {
      throw new Error(`metricSourceAssignments references unknown metric slug "${assignment.metricSlug}"`);
    }
    await prisma.metricDefinition.update({
      where: { id: metricDefinitionId },
      data: {
        primarySourceId: assignment.sourceKey ? sourceIdByKey.get(assignment.sourceKey) ?? null : null,
        calculationMethod: assignment.calculationMethod ?? null,
        limitations: assignment.limitations ?? null,
      },
    });
  }

  console.log("[4/11] Seeding governance models + core priorities...");
  const governanceModelIdBySlug = new Map<string, string>();
  for (const gm of governanceModels) {
    const row = await prisma.governanceModel.upsert({
      where: { slug: gm.slug },
      update: {
        name: gm.name,
        shortName: gm.shortName,
        summary: gm.summary,
        overview: gm.overview,
        history: gm.history,
        politicalContext: gm.politicalContext,
        foundedYear: gm.foundedYear,
        colorHex: gm.colorHex,
      },
      create: {
        slug: gm.slug,
        name: gm.name,
        shortName: gm.shortName,
        summary: gm.summary,
        overview: gm.overview,
        history: gm.history,
        politicalContext: gm.politicalContext,
        foundedYear: gm.foundedYear,
        colorHex: gm.colorHex,
        isPlaceholder: true,
      },
    });
    governanceModelIdBySlug.set(gm.slug, row.id);

    await prisma.corePriority.deleteMany({ where: { governanceModelId: row.id } });
    await prisma.corePriority.createMany({
      data: gm.corePriorities.map((p) => ({
        governanceModelId: row.id,
        title: p.title,
        description: p.description,
        sortOrder: p.sortOrder,
        isPlaceholder: true,
      })),
    });
  }

  console.log("[5/11] Seeding jurisdictions...");
  const jurisdictionIdBySlug = new Map<string, string>();
  for (const j of jurisdictions) {
    const governanceModelId = governanceModelIdBySlug.get(j.governanceModelSlug)!;
    const row = await prisma.jurisdiction.upsert({
      where: { slug: j.slug },
      update: {
        governanceModelId,
        name: j.name,
        kind: j.kind,
        stateOrRegion: j.stateOrRegion,
        country: j.country,
        population: j.population,
        populationYear: j.populationYear,
        latitude: j.latitude,
        longitude: j.longitude,
        summary: j.summary,
        description: j.description,
      },
      create: {
        governanceModelId,
        slug: j.slug,
        name: j.name,
        kind: j.kind,
        stateOrRegion: j.stateOrRegion,
        country: j.country,
        population: j.population,
        populationYear: j.populationYear,
        latitude: j.latitude,
        longitude: j.longitude,
        summary: j.summary,
        description: j.description,
        isPlaceholder: true,
      },
    });
    jurisdictionIdBySlug.set(j.slug, row.id);
  }

  console.log("[6/11] Seeding administrations...");
  // Clear dependents that cascade/reference administrations before recreating them.
  // Only synthetic MetricValue rows are cleared here — real imported observations (dataQuality
  // government/academic/alternative/estimated) must survive a reseed, since they came from the
  // CSV/admin import pipeline, not this script. "unavailable" rows are still synthetic under the
  // hood (same placeholder generator), just labeled differently, so they're cleared and
  // regenerated too. Administration deletion SetNulls their administrationId rather than erroring.
  //
  // PipelineAssessment/EvidenceLink/SupportingLegislation deletes are scoped to isPlaceholder: true
  // only. Real rows — both the hardcoded Chicago research in chicagoResearchedPipeline.ts (created
  // with isPlaceholder: false, see [10b/11] below) and anything a researcher submits later via the
  // admin write path (also isPlaceholder: false, see pipeline.service.ts createPipelineAssessment) —
  // must survive a reseed. An earlier version of this script deleted these tables unconditionally,
  // which would silently destroy real research on every reseed; do not revert this scoping.
  await prisma.metricValue.deleteMany({ where: { dataQuality: { in: ["placeholder", "unavailable"] } } });
  await prisma.evidenceLink.deleteMany({ where: { isPlaceholder: true } });
  await prisma.supportingLegislation.deleteMany({ where: { isPlaceholder: true } });
  await prisma.pipelineAssessment.deleteMany({ where: { isPlaceholder: true } });
  await prisma.campaignPromise.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.administration.deleteMany({});

  const administrationIdByKey = new Map<string, string>();
  const administrationsByJurisdiction = new Map<string, AdministrationWindow[]>();
  for (const a of administrations) {
    const jurisdictionId = jurisdictionIdBySlug.get(a.jurisdictionSlug)!;
    const row = await prisma.administration.create({
      data: {
        jurisdictionId,
        leaderName: a.leaderName,
        leaderTitle: a.leaderTitle,
        politicalParty: a.politicalParty,
        coalitionDescription: a.coalitionDescription,
        termNumber: a.termNumber,
        startDate: new Date(a.startDate),
        endDate: a.endDate ? new Date(a.endDate) : null,
        isPlaceholder: true,
      },
    });
    administrationIdByKey.set(`${a.jurisdictionSlug}::${a.leaderName}::${a.termNumber}`, row.id);

    const list = administrationsByJurisdiction.get(a.jurisdictionSlug) ?? [];
    list.push({ id: row.id, startDate: row.startDate, endDate: row.endDate });
    administrationsByJurisdiction.set(a.jurisdictionSlug, list);
  }
  for (const list of administrationsByJurisdiction.values()) {
    list.sort((x, y) => x.startDate.getTime() - y.startDate.getTime());
  }

  console.log("[7/11] Seeding campaign promises...");
  for (const cp of campaignPromises) {
    const administrationId = administrationIdByKey.get(`${cp.jurisdictionSlug}::${cp.leaderName}::${cp.termNumber}`);
    if (!administrationId) {
      throw new Error(`No administration found for campaign promise: ${cp.jurisdictionSlug} ${cp.leaderName} term ${cp.termNumber}`);
    }
    await prisma.campaignPromise.create({
      data: {
        administrationId,
        categoryId: cp.categorySlug ? categoryIdBySlug.get(cp.categorySlug) : null,
        title: cp.title,
        description: cp.description,
        status: cp.status,
        datePromised: cp.datePromised ? new Date(cp.datePromised) : null,
        isPlaceholder: true,
      },
    });
  }

  console.log("[8/11] Seeding timeline events...");
  const localNewsSourceId = sourceIdByKey.get("local_news")!;
  for (const te of timelineEvents) {
    await prisma.timelineEvent.create({
      data: {
        governanceModelId: te.scope === "governanceModel" ? governanceModelIdBySlug.get(te.slug) : null,
        jurisdictionId: te.scope === "jurisdiction" ? jurisdictionIdBySlug.get(te.slug) : null,
        eventDate: new Date(te.eventDate),
        title: te.title,
        description: te.description,
        eventType: te.eventType,
        sourceId: localNewsSourceId,
        isPlaceholder: true,
      },
    });
  }

  console.log("[9/11] Seeding policy areas...");
  // Upsert by slug — NOT delete-all-then-recreate. PolicyArea previously used deleteMany({}) here,
  // which (via PipelineAssessment's onDelete: Cascade on policyAreaId) silently cascaded away every
  // PipelineAssessment row on every single reseed, including real research — regardless of the
  // isPlaceholder scoping added to the deletes in [6/11] above. That scoping only matters if
  // PolicyArea rows themselves survive a reseed, which requires upserting them by their stable slug
  // (same pattern as categories, metric definitions, governance models, and jurisdictions above).
  const policyAreaIdBySlug = new Map<string, string>();
  for (const pa of policyAreas) {
    const row = await prisma.policyArea.upsert({
      where: { slug: pa.slug },
      update: {
        categoryId: categoryIdBySlug.get(pa.categorySlug) ?? null,
        name: pa.name,
        description: pa.description,
        sortOrder: pa.sortOrder,
      },
      create: {
        categoryId: categoryIdBySlug.get(pa.categorySlug) ?? null,
        slug: pa.slug,
        name: pa.name,
        description: pa.description,
        sortOrder: pa.sortOrder,
        isPlaceholder: true,
      },
    });
    policyAreaIdBySlug.set(pa.slug, row.id);
  }

  console.log("[10/11] Seeding pipeline assessments...");
  // Chicago's "affordable-housing-institution" policy area is real, researched data (see
  // chicagoResearchedPipeline.ts) — skip the synthetic generator for that one pair only.
  const researchedPairs = new Set(
    chicagoResearchedPipelineAssessments.map((r) => `${r.jurisdictionSlug}::${r.policyAreaSlug}`)
  );

  for (const j of jurisdictions) {
    const jurisdictionId = jurisdictionIdBySlug.get(j.slug)!;
    for (const pa of policyAreas) {
      if (researchedPairs.has(`${j.slug}::${pa.slug}`)) continue;

      const policyAreaId = policyAreaIdBySlug.get(pa.slug)!;
      const generated = generatePipelineAssessment(j.slug, j.name, pa.slug, pa.name);

      const assessment = await prisma.pipelineAssessment.create({
        data: {
          jurisdictionId,
          policyAreaId,
          stage: generated.stage,
          dataQuality: generated.dataQuality,
          assessmentDate: generated.assessmentDate,
          isCurrent: true,
          timelineNotes: generated.timelineNotes,
          evidenceSummary: generated.evidenceSummary,
          isPlaceholder: true,
        },
      });

      if (generated.legislation) {
        await prisma.supportingLegislation.create({
          data: {
            pipelineAssessmentId: assessment.id,
            title: generated.legislation.title,
            status: generated.legislation.status,
            sourceId: sourceIdByKey.get(generated.legislation.sourceKey) ?? null,
            isPlaceholder: true,
          },
        });
      }
      for (const link of generated.evidenceLinks) {
        await prisma.evidenceLink.create({
          data: {
            pipelineAssessmentId: assessment.id,
            label: link.label,
            url: link.url,
            evidenceType: link.evidenceType,
            sourceId: sourceIdByKey.get(link.sourceKey) ?? null,
            isPlaceholder: true,
          },
        });
      }
    }
  }

  console.log("[10b/11] Seeding researched pipeline assessments (Chicago pilot)...");
  // Create-if-missing per (jurisdiction, policyArea, assessmentDate) — never update. This makes
  // reseeding idempotent (running this script twice does not duplicate real research) while never
  // clobbering a row that a researcher may have since edited via the admin UI for this exact date.
  // To intentionally correct a mistake in this file's data, either bump the assessmentDate to a new
  // value or manually remove the specific stale row from the database — this script will not do it
  // for you, by design (see [6/11] above for why real rows are never blanket-deleted).
  let researchedCreated = 0;
  let researchedSkipped = 0;
  for (const r of chicagoResearchedPipelineAssessments) {
    const jurisdictionId = jurisdictionIdBySlug.get(r.jurisdictionSlug)!;
    const policyAreaId = policyAreaIdBySlug.get(r.policyAreaSlug)!;
    const assessmentDate = new Date(r.assessmentDate);

    const existing = await prisma.pipelineAssessment.findUnique({
      where: { jurisdictionId_policyAreaId_assessmentDate: { jurisdictionId, policyAreaId, assessmentDate } },
      select: { id: true },
    });
    if (existing) {
      researchedSkipped++;
      continue;
    }
    researchedCreated++;

    const assessment = await prisma.pipelineAssessment.create({
      data: {
        jurisdictionId,
        policyAreaId,
        stage: r.stage,
        dataQuality: r.dataQuality,
        assessmentDate,
        isCurrent: r.isCurrent,
        evidenceSummary: r.evidenceSummary,
        limitations: r.limitations,
        isPlaceholder: false,
      },
    });

    if (r.legislation) {
      await prisma.supportingLegislation.create({
        data: {
          pipelineAssessmentId: assessment.id,
          title: r.legislation.title,
          billNumber: r.legislation.billNumber,
          status: r.legislation.status,
          dateEnacted: r.legislation.dateEnacted ? new Date(r.legislation.dateEnacted) : null,
          url: r.legislation.url,
          sourceId: r.legislation.sourceKey ? sourceIdByKey.get(r.legislation.sourceKey) ?? null : null,
          isPlaceholder: false,
        },
      });
    }
    for (const link of r.evidenceLinks) {
      await prisma.evidenceLink.create({
        data: {
          pipelineAssessmentId: assessment.id,
          label: link.label,
          description: link.description,
          url: link.url,
          evidenceType: link.evidenceType,
          publicationDate: link.publicationDate ? new Date(link.publicationDate) : null,
          publisher: link.publisher,
          sourceTier: link.sourceTier,
          sourceId: link.sourceKey ? sourceIdByKey.get(link.sourceKey) ?? null : null,
          isPlaceholder: false,
        },
      });
    }
  }
  console.log(`  → ${researchedCreated} created, ${researchedSkipped} already present (untouched).`);

  console.log("[10c/11] Seeding research queue (create-if-missing, never overwrites researcher progress)...");
  // Same discipline as [10b/11] above: upsert by a stable `key`, and on the update branch touch ONLY
  // the fields this seed file owns (jurisdiction/policyArea/metric linkage, taskType, researchQuestion,
  // priority) — never status/assignedResearcher/sourceStatus/notes, which belong to whichever
  // researcher picked the task up. A reseed must never reset a researcher's progress on a task.
  let queueCreated = 0;
  let queueUpdated = 0;
  for (const item of researchQueueSeed) {
    const jurisdictionId = jurisdictionIdBySlug.get(item.jurisdictionSlug)!;
    const policyAreaId = item.policyAreaSlug ? policyAreaIdBySlug.get(item.policyAreaSlug) ?? null : null;
    const metricDefinitionId = item.metricSlug ? metricDefIdBySlug.get(item.metricSlug) ?? null : null;

    const existing = await prisma.researchTask.findUnique({ where: { key: item.key } });
    if (existing) {
      queueUpdated++;
      await prisma.researchTask.update({
        where: { key: item.key },
        data: {
          jurisdictionId,
          policyAreaId,
          metricDefinitionId,
          taskType: item.taskType,
          researchQuestion: item.researchQuestion,
          priority: item.priority,
        },
      });
      continue;
    }
    queueCreated++;
    await prisma.researchTask.create({
      data: {
        key: item.key,
        jurisdictionId,
        policyAreaId,
        metricDefinitionId,
        taskType: item.taskType,
        researchQuestion: item.researchQuestion,
        priority: item.priority,
      },
    });
  }
  console.log(`  → ${queueCreated} created, ${queueUpdated} refreshed (status/assignee/notes untouched).`);

  console.log("[11/11] Generating metric value time series...");
  const allMetricSpecs = Object.values(metricsByCategory).flat();
  let totalValues = 0;
  for (const j of jurisdictions) {
    const jurisdictionId = jurisdictionIdBySlug.get(j.slug)!;
    const adminWindows = administrationsByJurisdiction.get(j.slug) ?? [];

    for (const spec of allMetricSpecs) {
      const metricDefinitionId = metricDefIdBySlug.get(spec.slug)!;
      const points = generateAnnualSeries(spec, j.slug, j.population, adminWindows);

      const unavailableSpec = unavailableMetrics.find(
        (u) => u.metricSlug === spec.slug && u.jurisdictionSlug === j.slug
      );

      await prisma.metricValue.createMany({
        data: points.map((p) => {
          const isUnavailable =
            unavailableSpec && (!unavailableSpec.years || unavailableSpec.years.includes(p.periodStart.getUTCFullYear()));
          return {
            metricDefinitionId,
            jurisdictionId,
            administrationId: p.administrationId,
            sourceId: placeholderSourceId,
            periodType: "year",
            periodStart: p.periodStart,
            periodEnd: p.periodEnd,
            periodLabel: p.periodLabel,
            value: p.value,
            confidence: "modeled",
            ingestionMethod: "seed",
            dataQuality: isUnavailable ? "unavailable" : "placeholder",
            isPlaceholder: true,
          };
        }),
        skipDuplicates: true,
      });
      totalValues += points.length;
    }
  }

  console.log(`Done. Seeded ${totalValues} metric values across ${jurisdictions.length} jurisdictions and ${allMetricSpecs.length} metrics.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
