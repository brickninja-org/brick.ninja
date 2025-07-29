/*
  Warnings:

  - You are about to drop the column `currentId_de` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `currentId_en` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `currentId_es` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `currentId_fr` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `currentId_nl` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `name_de` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `name_es` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `name_fr` on the `ElementDesign` table. All the data in the column will be lost.
  - You are about to drop the column `name_nl` on the `ElementDesign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentId]` on the table `ElementDesign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentId` to the `ElementDesign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ElementDesign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ElementDesign" DROP CONSTRAINT "ElementDesign_currentId_de_fkey";

-- DropForeignKey
ALTER TABLE "ElementDesign" DROP CONSTRAINT "ElementDesign_currentId_en_fkey";

-- DropForeignKey
ALTER TABLE "ElementDesign" DROP CONSTRAINT "ElementDesign_currentId_es_fkey";

-- DropForeignKey
ALTER TABLE "ElementDesign" DROP CONSTRAINT "ElementDesign_currentId_fr_fkey";

-- DropForeignKey
ALTER TABLE "ElementDesign" DROP CONSTRAINT "ElementDesign_currentId_nl_fkey";

-- DropIndex
DROP INDEX "ElementDesign_currentId_de_key";

-- DropIndex
DROP INDEX "ElementDesign_currentId_en_key";

-- DropIndex
DROP INDEX "ElementDesign_currentId_es_key";

-- DropIndex
DROP INDEX "ElementDesign_currentId_fr_key";

-- DropIndex
DROP INDEX "ElementDesign_currentId_nl_key";

-- AlterTable
ALTER TABLE "ElementDesign" DROP COLUMN "currentId_de",
DROP COLUMN "currentId_en",
DROP COLUMN "currentId_es",
DROP COLUMN "currentId_fr",
DROP COLUMN "currentId_nl",
DROP COLUMN "name_de",
DROP COLUMN "name_en",
DROP COLUMN "name_es",
DROP COLUMN "name_fr",
DROP COLUMN "name_nl",
ADD COLUMN     "currentId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ElementDesign_currentId_key" ON "ElementDesign"("currentId");

-- AddForeignKey
ALTER TABLE "ElementDesign" ADD CONSTRAINT "ElementDesign_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
