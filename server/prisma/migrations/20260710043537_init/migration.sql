-- CreateTable
CREATE TABLE "GovernanceModel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "summary" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "history" TEXT NOT NULL,
    "politicalContext" TEXT NOT NULL,
    "foundedYear" INTEGER,
    "colorHex" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorePriority" (
    "id" TEXT NOT NULL,
    "governanceModelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CorePriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jurisdiction" (
    "id" TEXT NOT NULL,
    "governanceModelId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "stateOrRegion" TEXT,
    "country" TEXT NOT NULL,
    "population" INTEGER,
    "populationYear" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jurisdiction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administration" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "leaderTitle" TEXT NOT NULL,
    "politicalParty" TEXT,
    "coalitionDescription" TEXT,
    "termNumber" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "photoUrl" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Administration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignPromise" (
    "id" TEXT NOT NULL,
    "administrationId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "datePromised" TIMESTAMP(3),
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CampaignPromise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "colorHex" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricDefinition" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "higherIsBetter" BOOLEAN NOT NULL DEFAULT true,
    "decimalPrecision" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MetricDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetricValue" (
    "id" TEXT NOT NULL,
    "metricDefinitionId" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "administrationId" TEXT,
    "sourceId" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "value" DECIMAL(16,4) NOT NULL,
    "confidence" TEXT,
    "notes" TEXT,
    "ingestionMethod" TEXT NOT NULL DEFAULT 'seed',
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetricValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT,
    "sourceType" TEXT NOT NULL,
    "citation" TEXT,
    "retrievedAt" TIMESTAMP(3),
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "governanceModelId" TEXT,
    "jurisdictionId" TEXT,
    "administrationId" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "sourceId" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolicyArea" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PolicyArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineAssessment" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "policyAreaId" TEXT NOT NULL,
    "administrationId" TEXT,
    "stage" INTEGER NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "timelineNotes" TEXT,
    "evidenceSummary" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingLegislation" (
    "id" TEXT NOT NULL,
    "pipelineAssessmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "billNumber" TEXT,
    "status" TEXT,
    "dateEnacted" TIMESTAMP(3),
    "url" TEXT,
    "sourceId" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SupportingLegislation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceLink" (
    "id" TEXT NOT NULL,
    "pipelineAssessmentId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "isPlaceholder" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EvidenceLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GovernanceModel_slug_key" ON "GovernanceModel"("slug");

-- CreateIndex
CREATE INDEX "CorePriority_governanceModelId_idx" ON "CorePriority"("governanceModelId");

-- CreateIndex
CREATE UNIQUE INDEX "Jurisdiction_slug_key" ON "Jurisdiction"("slug");

-- CreateIndex
CREATE INDEX "Jurisdiction_governanceModelId_idx" ON "Jurisdiction"("governanceModelId");

-- CreateIndex
CREATE INDEX "Administration_jurisdictionId_startDate_idx" ON "Administration"("jurisdictionId", "startDate");

-- CreateIndex
CREATE INDEX "CampaignPromise_administrationId_idx" ON "CampaignPromise"("administrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MetricDefinition_slug_key" ON "MetricDefinition"("slug");

-- CreateIndex
CREATE INDEX "MetricDefinition_categoryId_idx" ON "MetricDefinition"("categoryId");

-- CreateIndex
CREATE INDEX "MetricValue_jurisdictionId_periodStart_idx" ON "MetricValue"("jurisdictionId", "periodStart");

-- CreateIndex
CREATE INDEX "MetricValue_metricDefinitionId_jurisdictionId_idx" ON "MetricValue"("metricDefinitionId", "jurisdictionId");

-- CreateIndex
CREATE INDEX "MetricValue_administrationId_idx" ON "MetricValue"("administrationId");

-- CreateIndex
CREATE UNIQUE INDEX "MetricValue_metricDefinitionId_jurisdictionId_periodType_pe_key" ON "MetricValue"("metricDefinitionId", "jurisdictionId", "periodType", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "Source_name_key" ON "Source"("name");

-- CreateIndex
CREATE INDEX "Source_sourceType_idx" ON "Source"("sourceType");

-- CreateIndex
CREATE INDEX "TimelineEvent_governanceModelId_idx" ON "TimelineEvent"("governanceModelId");

-- CreateIndex
CREATE INDEX "TimelineEvent_jurisdictionId_idx" ON "TimelineEvent"("jurisdictionId");

-- CreateIndex
CREATE INDEX "TimelineEvent_administrationId_idx" ON "TimelineEvent"("administrationId");

-- CreateIndex
CREATE INDEX "TimelineEvent_eventDate_idx" ON "TimelineEvent"("eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "PolicyArea_slug_key" ON "PolicyArea"("slug");

-- CreateIndex
CREATE INDEX "PolicyArea_categoryId_idx" ON "PolicyArea"("categoryId");

-- CreateIndex
CREATE INDEX "PipelineAssessment_jurisdictionId_policyAreaId_assessmentDa_idx" ON "PipelineAssessment"("jurisdictionId", "policyAreaId", "assessmentDate");

-- CreateIndex
CREATE INDEX "PipelineAssessment_isCurrent_idx" ON "PipelineAssessment"("isCurrent");

-- CreateIndex
CREATE INDEX "SupportingLegislation_pipelineAssessmentId_idx" ON "SupportingLegislation"("pipelineAssessmentId");

-- CreateIndex
CREATE INDEX "EvidenceLink_pipelineAssessmentId_idx" ON "EvidenceLink"("pipelineAssessmentId");

-- AddForeignKey
ALTER TABLE "CorePriority" ADD CONSTRAINT "CorePriority_governanceModelId_fkey" FOREIGN KEY ("governanceModelId") REFERENCES "GovernanceModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jurisdiction" ADD CONSTRAINT "Jurisdiction_governanceModelId_fkey" FOREIGN KEY ("governanceModelId") REFERENCES "GovernanceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administration" ADD CONSTRAINT "Administration_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignPromise" ADD CONSTRAINT "CampaignPromise_administrationId_fkey" FOREIGN KEY ("administrationId") REFERENCES "Administration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignPromise" ADD CONSTRAINT "CampaignPromise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricDefinition" ADD CONSTRAINT "MetricDefinition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_metricDefinitionId_fkey" FOREIGN KEY ("metricDefinitionId") REFERENCES "MetricDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_administrationId_fkey" FOREIGN KEY ("administrationId") REFERENCES "Administration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_governanceModelId_fkey" FOREIGN KEY ("governanceModelId") REFERENCES "GovernanceModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_administrationId_fkey" FOREIGN KEY ("administrationId") REFERENCES "Administration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyArea" ADD CONSTRAINT "PolicyArea_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineAssessment" ADD CONSTRAINT "PipelineAssessment_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineAssessment" ADD CONSTRAINT "PipelineAssessment_policyAreaId_fkey" FOREIGN KEY ("policyAreaId") REFERENCES "PolicyArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineAssessment" ADD CONSTRAINT "PipelineAssessment_administrationId_fkey" FOREIGN KEY ("administrationId") REFERENCES "Administration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingLegislation" ADD CONSTRAINT "SupportingLegislation_pipelineAssessmentId_fkey" FOREIGN KEY ("pipelineAssessmentId") REFERENCES "PipelineAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingLegislation" ADD CONSTRAINT "SupportingLegislation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceLink" ADD CONSTRAINT "EvidenceLink_pipelineAssessmentId_fkey" FOREIGN KEY ("pipelineAssessmentId") REFERENCES "PipelineAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceLink" ADD CONSTRAINT "EvidenceLink_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
