-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('CC', 'TI', 'CE', 'PA', 'NIT', 'PPT', 'PEP');

-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'GRACE_PERIOD', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "identificationType" "IdentificationType" NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_identificationType_identificationNumber_key" ON "people"("identificationType", "identificationNumber");

-- CreateIndex
CREATE INDEX "subscriptions_personId_status_idx" ON "subscriptions"("personId", "status");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
