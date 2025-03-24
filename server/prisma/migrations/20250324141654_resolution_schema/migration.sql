-- CreateTable
CREATE TABLE "Resolution" (
    "id" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "resolution" INTEGER[],

    CONSTRAINT "Resolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResolutionToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ResolutionToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ResolutionToVideo_B_index" ON "_ResolutionToVideo"("B");

-- AddForeignKey
ALTER TABLE "_ResolutionToVideo" ADD CONSTRAINT "_ResolutionToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Resolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResolutionToVideo" ADD CONSTRAINT "_ResolutionToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
