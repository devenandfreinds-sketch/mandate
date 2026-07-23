-- AlterTable
ALTER TABLE "MetricValue" ADD COLUMN     "methodologyVersion" TEXT,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3),
ADD COLUMN     "researchedById" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT;

-- AlterTable
ALTER TABLE "PipelineAssessment" ADD COLUMN     "methodologyVersion" TEXT,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3),
ADD COLUMN     "researchedById" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT;

-- AlterTable
ALTER TABLE "ResearchTask" ADD COLUMN     "assignedResearcherId" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "methodologyVersion" TEXT,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3),
ADD COLUMN     "reviewerId" TEXT,
ADD COLUMN     "revisionCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'researcher',
    "certificationLevel" TEXT NOT NULL DEFAULT 'new_researcher',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "MetricValue_nextReviewDate_idx" ON "MetricValue"("nextReviewDate");

-- CreateIndex
CREATE INDEX "PipelineAssessment_nextReviewDate_idx" ON "PipelineAssessment"("nextReviewDate");

-- CreateIndex
CREATE INDEX "ResearchTask_assignedResearcherId_idx" ON "ResearchTask"("assignedResearcherId");

-- CreateIndex
CREATE INDEX "ResearchTask_reviewerId_idx" ON "ResearchTask"("reviewerId");

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_researchedById_fkey" FOREIGN KEY ("researchedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetricValue" ADD CONSTRAINT "MetricValue_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineAssessment" ADD CONSTRAINT "PipelineAssessment_researchedById_fkey" FOREIGN KEY ("researchedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineAssessment" ADD CONSTRAINT "PipelineAssessment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchTask" ADD CONSTRAINT "ResearchTask_assignedResearcherId_fkey" FOREIGN KEY ("assignedResearcherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchTask" ADD CONSTRAINT "ResearchTask_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill methodologyVersion on existing REAL (non-placeholder) research only. Methodology
-- Version 1.0.0 is the only rubric that has ever existed in this project (see
-- shared/src/types/methodology.ts), so this is an honest label, not a fabricated value. Synthetic
-- placeholder rows are deliberately left NULL -- they were never "researched" under any
-- methodology and should not appear to carry a version they don't have.
UPDATE "MetricValue" SET "methodologyVersion" = '1.0.0' WHERE "isPlaceholder" = false;
UPDATE "PipelineAssessment" SET "methodologyVersion" = '1.0.0' WHERE "isPlaceholder" = false;
UPDATE "ResearchTask" SET "methodologyVersion" = '1.0.0';
