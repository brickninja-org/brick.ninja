-- CreateTable
CREATE TABLE "ElementDesign" (
    "id" INTEGER NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_es" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_nl" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "weight" DOUBLE PRECISION,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_de" TEXT NOT NULL,
    "currentId_en" TEXT NOT NULL,
    "currentId_es" TEXT NOT NULL,
    "currentId_fr" TEXT NOT NULL,
    "currentId_nl" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ElementDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignHistory" (
    "designId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "DesignHistory_pkey" PRIMARY KEY ("designId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElementDesign_currentId_de_key" ON "ElementDesign"("currentId_de");

-- CreateIndex
CREATE UNIQUE INDEX "ElementDesign_currentId_en_key" ON "ElementDesign"("currentId_en");

-- CreateIndex
CREATE UNIQUE INDEX "ElementDesign_currentId_es_key" ON "ElementDesign"("currentId_es");

-- CreateIndex
CREATE UNIQUE INDEX "ElementDesign_currentId_fr_key" ON "ElementDesign"("currentId_fr");

-- CreateIndex
CREATE UNIQUE INDEX "ElementDesign_currentId_nl_key" ON "ElementDesign"("currentId_nl");

-- CreateIndex
CREATE UNIQUE INDEX "DesignHistory_revisionId_key" ON "DesignHistory"("revisionId");

-- AddForeignKey
ALTER TABLE "ElementDesign" ADD CONSTRAINT "ElementDesign_currentId_de_fkey" FOREIGN KEY ("currentId_de") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementDesign" ADD CONSTRAINT "ElementDesign_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementDesign" ADD CONSTRAINT "ElementDesign_currentId_es_fkey" FOREIGN KEY ("currentId_es") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementDesign" ADD CONSTRAINT "ElementDesign_currentId_fr_fkey" FOREIGN KEY ("currentId_fr") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementDesign" ADD CONSTRAINT "ElementDesign_currentId_nl_fkey" FOREIGN KEY ("currentId_nl") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignHistory" ADD CONSTRAINT "DesignHistory_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ElementDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignHistory" ADD CONSTRAINT "DesignHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
