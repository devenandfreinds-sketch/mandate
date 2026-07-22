-- CreateTable
CREATE TABLE "ResearchTask" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "policyAreaId" TEXT,
    "metricDefinitionId" TEXT,
    "taskType" TEXT NOT NULL,
    "researchQuestion" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "status" TEXT NOT NULL DEFAULT 'unassigned',
    "assignedResearcher" TEXT,
    "sourceStatus" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchTask_key_key" ON "ResearchTask"("key");

-- CreateIndex
CREATE INDEX "ResearchTask_status_idx" ON "ResearchTask"("status");

-- CreateIndex
CREATE INDEX "ResearchTask_jurisdictionId_idx" ON "ResearchTask"("jurisdictionId");

-- AddForeignKey
ALTER TABLE "ResearchTask" ADD CONSTRAINT "ResearchTask_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchTask" ADD CONSTRAINT "ResearchTask_policyAreaId_fkey" FOREIGN KEY ("policyAreaId") REFERENCES "PolicyArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchTask" ADD CONSTRAINT "ResearchTask_metricDefinitionId_fkey" FOREIGN KEY ("metricDefinitionId") REFERENCES "MetricDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

