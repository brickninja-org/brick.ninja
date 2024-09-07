-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_nl" TEXT NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_en" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemHistory" (
    "itemId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "ItemHistory_pkey" PRIMARY KEY ("itemId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_currentId_en_key" ON "Item"("currentId_en");

-- CreateIndex
CREATE INDEX "Item_createdAt_idx" ON "Item"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ItemHistory_revisionId_key" ON "ItemHistory"("revisionId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemHistory" ADD CONSTRAINT "ItemHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
