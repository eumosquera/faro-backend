-- CreateEnum
CREATE TYPE "PrivateUnitType" AS ENUM ('APARTMENT', 'HOUSE', 'LOCAL', 'OFFICE');

-- CreateEnum
CREATE TYPE "PrivateUnitStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "PrivateUnit" (
    "id" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "physicalGroupId" TEXT,
    "identifier" TEXT NOT NULL,
    "type" "PrivateUnitType" NOT NULL,
    "status" "PrivateUnitStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrivateUnit_residentialComplexId_idx" ON "PrivateUnit"("residentialComplexId");

-- CreateIndex
CREATE INDEX "PrivateUnit_physicalGroupId_idx" ON "PrivateUnit"("physicalGroupId");

-- AddForeignKey
ALTER TABLE "PrivateUnit" ADD CONSTRAINT "PrivateUnit_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "ResidentialComplex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateUnit" ADD CONSTRAINT "PrivateUnit_physicalGroupId_fkey" FOREIGN KEY ("physicalGroupId") REFERENCES "PhysicalGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
