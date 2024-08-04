-- CreateEnum
CREATE TYPE "ColorType" AS ENUM ('Solid', 'Unknown');

-- CreateTable
CREATE TABLE "Color" (
    "id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "ColorType" NOT NULL,
    "removedFromApi" BOOLEAN NOT NULL DEFAULT false,
    "currentId_en" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorHistory" (
    "colorId" INTEGER NOT NULL,
    "revisionId" TEXT NOT NULL,

    CONSTRAINT "ColorHistory_pkey" PRIMARY KEY ("colorId","revisionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_currentId_en_key" ON "Color"("currentId_en");

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_currentId_en_fkey" FOREIGN KEY ("currentId_en") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorHistory" ADD CONSTRAINT "ColorHistory_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorHistory" ADD CONSTRAINT "ColorHistory_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
