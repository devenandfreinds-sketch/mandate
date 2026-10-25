-- CreateTable
CREATE TABLE "OutreachAccount" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "segment" TEXT,
    "website" TEXT,
    "hq" TEXT,
    "strategy" TEXT,
    "aumLabel" TEXT,
    "aumSource" TEXT,
    "fitScore" INTEGER,
    "fitReason" TEXT,
    "whyMandate" TEXT,
    "evidence" JSONB,
    "sources" JSONB,
    "caveats" TEXT,
    "contactEmail" TEXT,
    "contactEmailType" TEXT,
    "contactEmailSource" TEXT,
    "contactOther" TEXT,
    "stage" TEXT NOT NULL DEFAULT 'prospect',
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT,
    "nextStep" TEXT,
    "nextStepDate" TIMESTAMP(3),
    "dealTier" TEXT,
    "dealValueAnnual" INTEGER,
    "draftSubject" TEXT,
    "draftBody" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachContact" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutreachContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachActivity" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "contactId" TEXT,
    "type" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" TEXT,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutreachActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutreachAccount_slug_key" ON "OutreachAccount"("slug");

-- CreateIndex
CREATE INDEX "OutreachAccount_stage_idx" ON "OutreachAccount"("stage");

-- CreateIndex
CREATE INDEX "OutreachAccount_city_idx" ON "OutreachAccount"("city");

-- CreateIndex
CREATE INDEX "OutreachAccount_nextStepDate_idx" ON "OutreachAccount"("nextStepDate");

-- CreateIndex
CREATE INDEX "OutreachContact_accountId_idx" ON "OutreachContact"("accountId");

-- CreateIndex
CREATE INDEX "OutreachActivity_accountId_occurredAt_idx" ON "OutreachActivity"("accountId", "occurredAt");

-- CreateIndex
CREATE INDEX "OutreachActivity_occurredAt_idx" ON "OutreachActivity"("occurredAt");

-- AddForeignKey
ALTER TABLE "OutreachContact" ADD CONSTRAINT "OutreachContact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "OutreachAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachActivity" ADD CONSTRAINT "OutreachActivity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "OutreachAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachActivity" ADD CONSTRAINT "OutreachActivity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "OutreachContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
