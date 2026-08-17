-- CreateEnum
CREATE TYPE "AccessAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "access_accounts" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "externalAuthId" TEXT NOT NULL,
    "status" "AccessAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_accounts_personId_key" ON "access_accounts"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "access_accounts_externalAuthId_key" ON "access_accounts"("externalAuthId");

-- AddForeignKey
ALTER TABLE "access_accounts" ADD CONSTRAINT "access_accounts_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
