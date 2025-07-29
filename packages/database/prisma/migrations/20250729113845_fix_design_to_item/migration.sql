/*
  Warnings:

  - You are about to drop the `_elements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_elements" DROP CONSTRAINT "_elements_A_fkey";

-- DropForeignKey
ALTER TABLE "_elements" DROP CONSTRAINT "_elements_B_fkey";

-- DropTable
DROP TABLE "_elements";

-- CreateTable
CREATE TABLE "_ElementDesignToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ElementDesignToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ElementDesignToItem_B_index" ON "_ElementDesignToItem"("B");

-- AddForeignKey
ALTER TABLE "_ElementDesignToItem" ADD CONSTRAINT "_ElementDesignToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "ElementDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementDesignToItem" ADD CONSTRAINT "_ElementDesignToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
