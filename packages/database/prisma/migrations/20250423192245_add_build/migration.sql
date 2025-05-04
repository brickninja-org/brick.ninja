/*
  Warnings:

  - Added the required column `buildId` to the `Revision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Revision" ADD COLUMN     "buildId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Build" (
    "id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
