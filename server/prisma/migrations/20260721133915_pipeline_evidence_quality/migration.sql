/*
  Warnings:

  - Added the required column `updatedAt` to the `PipelineAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvidenceLink" ADD COLUMN     "description" TEXT,
ADD COLUMN     "publicationDate" TIMESTAMP(3),
ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "sourceTier" TEXT;

-- AlterTable
ALTER TABLE "PipelineAssessment" ADD COLUMN     "dataQuality" TEXT NOT NULL DEFAULT 'placeholder',
ADD COLUMN     "limitations" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Backfill existing rows: use createdAt as a reasonable stand-in for "last updated" until a real edit happens.
UPDATE "PipelineAssessment" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

ALTER TABLE "PipelineAssessment" ALTER COLUMN "updatedAt" SET NOT NULL;
