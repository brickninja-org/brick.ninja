/*
  Warnings:

  - Made the column `plastic_code` on table `Color` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Color" ALTER COLUMN "plastic_code" SET NOT NULL;
