-- CreateEnum
CREATE TYPE "PhysicalGroupType" AS ENUM ('TOWER', 'BLOCK');

-- CreateTable
CREATE TABLE "PhysicalGroup" (
    "id" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PhysicalGroupType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhysicalGroup_residentialComplexId_idx" ON "PhysicalGroup"("residentialComplexId");

-- AddForeignKey
ALTER TABLE "PhysicalGroup" ADD CONSTRAINT "PhysicalGroup_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "ResidentialComplex"("id") ON DELETE CASCADE ON UPDATE CASCADE;
