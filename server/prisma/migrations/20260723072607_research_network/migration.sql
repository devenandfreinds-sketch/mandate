-- AlterTable
ALTER TABLE "User" ADD COLUMN     "affiliation" TEXT NOT NULL DEFAULT 'internal';

-- CreateTable
CREATE TABLE "ExternalContribution" (
    "id" TEXT NOT NULL,
    "contributorName" TEXT NOT NULL,
    "contributorEmail" TEXT,
    "contributorAffiliation" TEXT,
    "contributorUserId" TEXT,
    "contributionType" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "jurisdictionId" TEXT,
    "description" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "relationToExistingResearch" TEXT,
    "limitations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalContribution_status_idx" ON "ExternalContribution"("status");

-- CreateIndex
CREATE INDEX "ExternalContribution_jurisdictionId_idx" ON "ExternalContribution"("jurisdictionId");

-- CreateIndex
CREATE INDEX "ExternalContribution_contributorUserId_idx" ON "ExternalContribution"("contributorUserId");

-- CreateIndex
CREATE INDEX "User_affiliation_idx" ON "User"("affiliation");

-- AddForeignKey
ALTER TABLE "ExternalContribution" ADD CONSTRAINT "ExternalContribution_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalContribution" ADD CONSTRAINT "ExternalContribution_contributorUserId_fkey" FOREIGN KEY ("contributorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalContribution" ADD CONSTRAINT "ExternalContribution_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
