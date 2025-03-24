/*
  Warnings:

  - A unique constraint covering the columns `[quality]` on the table `Resolution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Resolution_quality_key" ON "Resolution"("quality");
