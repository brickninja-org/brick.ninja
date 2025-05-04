/*
  Warnings:

  - You are about to drop the column `categoryIds` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `minAge` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `minifigureCount` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `pieceCount` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `productCode` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `released` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `ItemCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemCategoryHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemToItemCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_currentId_en_fkey";

-- DropForeignKey
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_currentId_nl_fkey";

-- DropForeignKey
ALTER TABLE "ItemCategoryHistory" DROP CONSTRAINT "ItemCategoryHistory_itemCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCategoryHistory" DROP CONSTRAINT "ItemCategoryHistory_revisionId_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToItemCategory" DROP CONSTRAINT "_ItemToItemCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToItemCategory" DROP CONSTRAINT "_ItemToItemCategory_B_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "categoryIds",
DROP COLUMN "minAge",
DROP COLUMN "minifigureCount",
DROP COLUMN "pieceCount",
DROP COLUMN "productCode",
DROP COLUMN "released",
DROP COLUMN "year";

-- DropTable
DROP TABLE "ItemCategory";

-- DropTable
DROP TABLE "ItemCategoryHistory";

-- DropTable
DROP TABLE "_ItemToItemCategory";

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_nl" TEXT NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_en" TEXT NOT NULL,
    "currentId_nl" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryHistory" (
    "itemCategoryId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "CategoryHistory_pkey" PRIMARY KEY ("itemCategoryId","revisionId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_nl" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "subtype" TEXT,
    "currentId_en" TEXT NOT NULL,
    "currentId_nl" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductHistory" (
    "productId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "ProductHistory_pkey" PRIMARY KEY ("productId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_currentId_en_key" ON "Category"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Category_currentId_nl_key" ON "Category"("currentId_nl");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryHistory_revisionId_key" ON "CategoryHistory"("revisionId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_currentId_en_key" ON "Product"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "Product_currentId_nl_key" ON "Product"("currentId_nl");

-- CreateIndex
CREATE UNIQUE INDEX "ProductHistory_revisionId_key" ON "ProductHistory"("revisionId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_currentId_nl_fkey" FOREIGN KEY ("currentId_nl") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryHistory" ADD CONSTRAINT "CategoryHistory_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryHistory" ADD CONSTRAINT "CategoryHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_currentId_nl_fkey" FOREIGN KEY ("currentId_nl") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHistory" ADD CONSTRAINT "ProductHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHistory" ADD CONSTRAINT "ProductHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
