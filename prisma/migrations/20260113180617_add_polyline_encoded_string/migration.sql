/*
  Warnings:

  - Added the required column `destinationName` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originName` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationName` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originName` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `polylineSrting` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "destinationName" TEXT NOT NULL,
ADD COLUMN     "originName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "destinationName" TEXT NOT NULL,
ADD COLUMN     "originName" TEXT NOT NULL,
ADD COLUMN     "polylineSrting" TEXT NOT NULL;
