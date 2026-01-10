/*
  Warnings:

  - Added the required column `destination` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "destination" geometry NOT NULL,
ADD COLUMN     "origin" geometry NOT NULL;
