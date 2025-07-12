/*
  Warnings:

  - A unique constraint covering the columns `[currentId_de]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_es]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_fr]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_de]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_es]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_fr]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_de]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_es]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_fr]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_de]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_es]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[currentId_fr]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentId_de` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_es` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_fr` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_de` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_de` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_es` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_fr` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_de` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_de` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_es` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_fr` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_de` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_de` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_es` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentId_fr` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_de` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Language" ADD VALUE 'de';
ALTER TYPE "Language" ADD VALUE 'es';
ALTER TYPE "Language" ADD VALUE 'fr';

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "currentId_de" TEXT NOT NULL,
ADD COLUMN     "currentId_es" TEXT NOT NULL,
ADD COLUMN     "currentId_fr" TEXT NOT NULL,
ADD COLUMN     "name_de" TEXT NOT NULL,
ADD COLUMN     "name_es" TEXT NOT NULL,
ADD COLUMN     "name_fr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "currentId_de" TEXT NOT NULL,
ADD COLUMN     "currentId_es" TEXT NOT NULL,
ADD COLUMN     "currentId_fr" TEXT NOT NULL,
ADD COLUMN     "name_de" TEXT NOT NULL,
ADD COLUMN     "name_es" TEXT NOT NULL,
ADD COLUMN     "name_fr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "currentId_de" TEXT NOT NULL,
ADD COLUMN     "currentId_es" TEXT NOT NULL,
ADD COLUMN     "currentId_fr" TEXT NOT NULL,
ADD COLUMN     "name_de" TEXT NOT NULL,
ADD COLUMN     "name_es" TEXT NOT NULL,
ADD COLUMN     "name_fr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "currentId_de" TEXT NOT NULL,
ADD COLUMN     "currentId_es" TEXT NOT NULL,
ADD COLUMN     "currentId_fr" TEXT NOT NULL,
ADD COLUMN     "name_de" TEXT NOT NULL,
ADD COLUMN     "name_es" TEXT NOT NULL,
ADD COLUMN     "name_fr" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_currentId_de_key" ON "Category"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Category_currentId_es_key" ON "Category"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Category_currentId_fr_key" ON "Category"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "Color_currentId_de_key" ON "Color"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Color_currentId_es_key" ON "Color"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Color_currentId_fr_key" ON "Color"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "Item_currentId_de_key" ON "Item"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Item_currentId_es_key" ON "Item"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Item_currentId_fr_key" ON "Item"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "Product_currentId_de_key" ON "Product"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "Product_currentId_es_key" ON "Product"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "Product_currentId_fr_key" ON "Product"("currentId_fr");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
