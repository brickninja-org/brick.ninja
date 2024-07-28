-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL,
    "entity" TEXT,
    "schema" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "description" TEXT,
    "language" "Language" NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);
