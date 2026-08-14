/*
  Warnings:

  - Added the required column `quarterlyPrice` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "quarterlyPrice" DECIMAL(10,2) NOT NULL;
