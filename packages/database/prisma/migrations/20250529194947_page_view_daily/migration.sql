-- DropIndex
DROP INDEX "PageView_time_idx";

-- AlterTable
ALTER TABLE "PageView" ADD COLUMN     "asn" INTEGER;

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
