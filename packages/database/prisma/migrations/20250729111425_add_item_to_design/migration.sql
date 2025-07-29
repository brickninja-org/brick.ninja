-- CreateTable
CREATE TABLE "_elements" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_elements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_elements_B_index" ON "_elements"("B");

-- AddForeignKey
ALTER TABLE "_elements" ADD CONSTRAINT "_elements_A_fkey" FOREIGN KEY ("A") REFERENCES "ElementDesign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_elements" ADD CONSTRAINT "_elements_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
