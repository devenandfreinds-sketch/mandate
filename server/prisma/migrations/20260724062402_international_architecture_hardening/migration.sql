-- DropIndex
DROP INDEX "PipelineAssessment_jurisdictionId_policyAreaId_assessmentDa_idx";

-- DropIndex
DROP INDEX "PipelineAssessment_jurisdictionId_policyAreaId_assessmentDa_key";

-- AlterTable
ALTER TABLE "Jurisdiction" ADD COLUMN     "administrativeLevel" TEXT,
ADD COLUMN     "parentJurisdictionId" TEXT;

-- AlterTable
ALTER TABLE "MetricValue" ADD COLUMN     "currencyCode" TEXT NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "PipelineAssessment" ADD COLUMN     "institutionName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "country" TEXT,
ADD COLUMN     "language" TEXT;

-- CreateIndex
CREATE INDEX "Jurisdiction_parentJurisdictionId_idx" ON "Jurisdiction"("parentJurisdictionId");

-- CreateIndex
CREATE INDEX "PipelineAssessment_jurisdictionId_policyAreaId_institutionN_idx" ON "PipelineAssessment"("jurisdictionId", "policyAreaId", "institutionName", "assessmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineAssessment_jurisdictionId_policyAreaId_institutionN_key" ON "PipelineAssessment"("jurisdictionId", "policyAreaId", "institutionName", "assessmentDate");

-- AddForeignKey
ALTER TABLE "Jurisdiction" ADD CONSTRAINT "Jurisdiction_parentJurisdictionId_fkey" FOREIGN KEY ("parentJurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

