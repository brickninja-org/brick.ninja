CREATE EXTENSION IF NOT EXISTS timescaledb;

-- CreateTable
CREATE TABLE "PageView" (
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "PageView_time_page_pageId_key" ON "PageView"("time", "page", "pageId");

-- create hypertable
SELECT create_hypertable('"PageView"', by_range('time'));
