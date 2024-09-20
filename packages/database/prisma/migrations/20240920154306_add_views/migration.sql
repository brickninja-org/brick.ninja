-- CreateTable
CREATE TABLE "PageView" (
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL DEFAULT 0,
    "asn" INTEGER
);

-- CreateTable
CREATE TABLE "PageView_daily" (
    "bucket" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PageView_time_page_pageId_key" ON "PageView"("time", "page", "pageId");

-- CreateIndex
CREATE UNIQUE INDEX "PageView_daily_bucket_page_pageId_key" ON "PageView_daily"("bucket", "page", "pageId");
