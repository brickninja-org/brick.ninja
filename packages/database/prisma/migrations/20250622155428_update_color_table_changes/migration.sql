/*
  Warnings:

  - You are about to drop the column `type` on the `Color` table. All the data in the column will be lost.
  - Made the column `color_family` on table `Color` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Color" DROP COLUMN "type",
ALTER COLUMN "color_family" SET NOT NULL,
ALTER COLUMN "color_family" SET DEFAULT '',
ALTER COLUMN "plastic_code" SET DEFAULT '';

-- DropEnum
DROP TYPE "Availability";
