-- CreateEnum
CREATE TYPE "PersonUnitStatus" AS ENUM ('ACTIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "person_units" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "privateUnitId" TEXT NOT NULL,
    "rolePersonaId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "PersonUnitStatus" NOT NULL DEFAULT 'ACTIVE',
    "observations" TEXT,

    CONSTRAINT "person_units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "person_units_personId_idx" ON "person_units"("personId");

-- CreateIndex
CREATE INDEX "person_units_privateUnitId_idx" ON "person_units"("privateUnitId");

-- CreateIndex
CREATE INDEX "person_units_rolePersonaId_idx" ON "person_units"("rolePersonaId");

-- AddForeignKey
ALTER TABLE "person_units" ADD CONSTRAINT "person_units_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_units" ADD CONSTRAINT "person_units_privateUnitId_fkey" FOREIGN KEY ("privateUnitId") REFERENCES "PrivateUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_units" ADD CONSTRAINT "person_units_rolePersonaId_fkey" FOREIGN KEY ("rolePersonaId") REFERENCES "role_personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
