-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "categoryIds" INTEGER[];

-- CreateTable
CREATE TABLE "ItemCategory" (
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

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCategoryHistory" (
    "itemCategoryId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "ItemCategoryHistory_pkey" PRIMARY KEY ("itemCategoryId","revisionId")
);

-- CreateTable
CREATE TABLE "_ItemToItemCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_currentId_en_key" ON "ItemCategory"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_currentId_nl_key" ON "ItemCategory"("currentId_nl");

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategoryHistory_revisionId_key" ON "ItemCategoryHistory"("revisionId");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToItemCategory_AB_unique" ON "_ItemToItemCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToItemCategory_B_index" ON "_ItemToItemCategory"("B");

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_currentId_nl_fkey" FOREIGN KEY ("currentId_nl") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCategoryHistory" ADD CONSTRAINT "ItemCategoryHistory_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "ItemCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCategoryHistory" ADD CONSTRAINT "ItemCategoryHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToItemCategory" ADD CONSTRAINT "_ItemToItemCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToItemCategory" ADD CONSTRAINT "_ItemToItemCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
