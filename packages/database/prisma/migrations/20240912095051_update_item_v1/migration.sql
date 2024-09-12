-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "minifigureCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pieceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "subtype" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';
