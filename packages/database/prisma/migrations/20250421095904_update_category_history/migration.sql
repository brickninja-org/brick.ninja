/*
  Warnings:

  - The primary key for the `CategoryHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `itemCategoryId` on the `CategoryHistory` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `CategoryHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryHistory" DROP CONSTRAINT "CategoryHistory_itemCategoryId_fkey";

-- AlterTable
ALTER TABLE "CategoryHistory" DROP CONSTRAINT "CategoryHistory_pkey",
DROP COLUMN "itemCategoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "CategoryHistory_pkey" PRIMARY KEY ("categoryId", "revisionId");

-- AddForeignKey
ALTER TABLE "CategoryHistory" ADD CONSTRAINT "CategoryHistory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
