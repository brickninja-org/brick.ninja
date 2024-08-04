/*
  Warnings:

  - A unique constraint covering the columns `[previousRevisionId]` on the table `Revision` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('Updated', 'Imported', 'Added', 'Removed');

-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "previousRevisionId" TEXT,
ADD COLUMN     "type" "RevisionType" NOT NULL DEFAULT 'Updated';

-- CreateIndex
CREATE UNIQUE INDEX "Revision_previousRevisionId_key" ON "Revision"("previousRevisionId");

-- CreateIndex
CREATE INDEX "Revision_language_type_idx" ON "Revision"("language", "type");

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_previousRevisionId_fkey" FOREIGN KEY ("previousRevisionId") REFERENCES "Revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;
