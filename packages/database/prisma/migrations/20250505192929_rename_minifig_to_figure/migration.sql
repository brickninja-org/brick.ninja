/*
  Warnings:

  - You are about to drop the column `minifigureCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "minifigureCount",
ADD COLUMN     "figureCount" INTEGER;
