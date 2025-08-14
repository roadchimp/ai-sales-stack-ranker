/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Opportunity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Opportunity" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_externalId_key" ON "public"."Opportunity"("externalId");
