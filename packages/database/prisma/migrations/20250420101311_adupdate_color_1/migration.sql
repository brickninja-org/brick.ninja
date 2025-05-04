/*
  Warnings:

  - You are about to drop the column `code` on the `Color` table. All the data in the column will be lost.
  - The `type` column on the `Color` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Color" DROP COLUMN "code",
ADD COLUMN     "color_family" TEXT,
ADD COLUMN     "plastic_code" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';

-- DropEnum
DROP TYPE "ColorType";
