-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "instructionItemIds" INTEGER[];

-- CreateTable
CREATE TABLE "_instruction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_instruction_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_instruction_B_index" ON "_instruction"("B");

-- AddForeignKey
ALTER TABLE "_instruction" ADD CONSTRAINT "_instruction_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_instruction" ADD CONSTRAINT "_instruction_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
