-- AlterTable
ALTER TABLE "ImportJob" ADD COLUMN     "restoredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ImportRowResult" ADD COLUMN     "restoreValueJson" TEXT;
