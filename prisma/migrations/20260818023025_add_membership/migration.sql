-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "accessAccountId" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "accessRoleId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Membership_personId_idx" ON "Membership"("personId");

-- CreateIndex
CREATE INDEX "Membership_accessAccountId_idx" ON "Membership"("accessAccountId");

-- CreateIndex
CREATE INDEX "Membership_residentialComplexId_idx" ON "Membership"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Membership_accessRoleId_idx" ON "Membership"("accessRoleId");

-- CreateIndex
CREATE INDEX "Membership_status_idx" ON "Membership"("status");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_accessAccountId_fkey" FOREIGN KEY ("accessAccountId") REFERENCES "access_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_accessRoleId_fkey" FOREIGN KEY ("accessRoleId") REFERENCES "access_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
