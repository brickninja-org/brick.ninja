/*
  Warnings:

  - A unique constraint covering the columns `[currentId_nl]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentId_nl` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "currentId_nl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_currentId_nl_key" ON "Item"("currentId_nl");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_nl_fkey" FOREIGN KEY ("currentId_nl") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
