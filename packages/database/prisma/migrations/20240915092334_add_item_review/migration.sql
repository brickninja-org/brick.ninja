-- CreateEnum
CREATE TYPE "ReviewQueue" AS ENUM ('ContainerContent');

-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('Open', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT,
    "reviewerId" TEXT,
    "queue" "ReviewQueue" NOT NULL,
    "changes" JSONB NOT NULL,
    "state" "ReviewState" NOT NULL DEFAULT 'Open',
    "relatedItemId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_relatedItemId_fkey" FOREIGN KEY ("relatedItemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
