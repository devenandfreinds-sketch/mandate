-- AlterTable
ALTER TABLE "MetricDefinition" ADD COLUMN     "calculationMethod" TEXT,
ADD COLUMN     "coverageNote" TEXT,
ADD COLUMN     "limitations" TEXT,
ADD COLUMN     "primarySourceId" TEXT;

-- AlterTable
ALTER TABLE "MetricValue" ADD COLUMN     "dataQuality" TEXT NOT NULL DEFAULT 'placeholder';

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "defaultConfidence" TEXT,
ADD COLUMN     "methodology" TEXT,
ADD COLUMN     "publicationDate" TIMESTAMP(3),
ADD COLUMN     "updateFrequency" TEXT;

-- CreateTable
CREATE TABLE "ImportJob" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "importType" TEXT NOT NULL,
    "categorySlug" TEXT,
    "status" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "invalidRows" INTEGER NOT NULL DEFAULT 0,
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "triggeredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "rolledBackAt" TIMESTAMP(3),

    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRowResult" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "metricValueId" TEXT,
    "previousValueJson" TEXT,
    "rawData" TEXT NOT NULL,

    CONSTRAINT "ImportRowResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportJob_status_idx" ON "ImportJob"("status");

-- CreateIndex
CREATE INDEX "ImportJob_createdAt_idx" ON "ImportJob"("createdAt");

-- CreateIndex
CREATE INDEX "ImportRowResult_importJobId_idx" ON "ImportRowResult"("importJobId");

-- CreateIndex
CREATE INDEX "MetricDefinition_primarySourceId_idx" ON "MetricDefinition"("primarySourceId");

-- AddForeignKey
ALTER TABLE "MetricDefinition" ADD CONSTRAINT "MetricDefinition_primarySourceId_fkey" FOREIGN KEY ("primarySourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportRowResult" ADD CONSTRAINT "ImportRowResult_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
