/*
  Warnings:

  - The values [active] on the enum `TripStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `shiftDestinationId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `shiftOriginId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `destinationId` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `originId` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `routeId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationPoint` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxWalkMeters` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originPoint` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "RideMatchStatus" AS ENUM ('proposed', 'accepted', 'declined', 'cancelled');

-- AlterEnum
BEGIN;
CREATE TYPE "TripStatus_new" AS ENUM ('searching', 'matched', 'accepted', 'pending', 'started', 'completed', 'cancelled');
ALTER TABLE "public"."Trip" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Trip" ALTER COLUMN "status" TYPE "TripStatus_new" USING ("status"::text::"TripStatus_new");
ALTER TYPE "TripStatus" RENAME TO "TripStatus_old";
ALTER TYPE "TripStatus_new" RENAME TO "TripStatus";
DROP TYPE "public"."TripStatus_old";
ALTER TABLE "Trip" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_shiftDestinationId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_shiftOriginId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_originId_fkey";

-- DropIndex
DROP INDEX "Location_shiftDestinationId_key";

-- DropIndex
DROP INDEX "Location_shiftOriginId_key";

-- DropIndex
DROP INDEX "shift_route_idx";

-- DropIndex
DROP INDEX "Trip_destinationId_key";

-- DropIndex
DROP INDEX "Trip_originId_key";

-- DropIndex
DROP INDEX "trip_route_idx";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "shiftDestinationId",
DROP COLUMN "shiftOriginId";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "route",
ADD COLUMN     "routeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "destinationId",
DROP COLUMN "endTime",
DROP COLUMN "originId",
DROP COLUMN "route",
DROP COLUMN "startTime",
ADD COLUMN     "destinationPoint" geometry NOT NULL,
ADD COLUMN     "earliestStart" TIMESTAMP(3),
ADD COLUMN     "latestStart" TIMESTAMP(3),
ADD COLUMN     "maxWalkMeters" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mode" "TransportMode" NOT NULL DEFAULT 'public',
ADD COLUMN     "originPoint" geometry NOT NULL,
ADD COLUMN     "vehicleType" "VehicleCategory",
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "geometry" geometry NOT NULL,
    "lengthMeters" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideMatch" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "pickupPoint" geometry NOT NULL,
    "dropoffPoint" geometry NOT NULL,
    "pickupFraction" DOUBLE PRECISION NOT NULL,
    "dropoffFraction" DOUBLE PRECISION NOT NULL,
    "pickupWalkMeters" DOUBLE PRECISION NOT NULL,
    "dropoffWalkMeters" DOUBLE PRECISION NOT NULL,
    "estimatedPickupTime" TIMESTAMP(3) NOT NULL,
    "estimatedDropoffTime" TIMESTAMP(3) NOT NULL,
    "status" "RideMatchStatus" NOT NULL DEFAULT 'proposed',
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RideMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_geometry_idx" ON "Route" USING GIST ("geometry");

-- CreateIndex
CREATE INDEX "RideMatch_pickupPoint_idx" ON "RideMatch" USING GIST ("pickupPoint");

-- CreateIndex
CREATE INDEX "RideMatch_shiftId_status_idx" ON "RideMatch"("shiftId", "status");

-- CreateIndex
CREATE INDEX "Trip_originPoint_idx" ON "Trip" USING GIST ("originPoint");

-- CreateIndex
CREATE INDEX "Trip_destinationPoint_idx" ON "Trip" USING GIST ("destinationPoint");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideMatch" ADD CONSTRAINT "RideMatch_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideMatch" ADD CONSTRAINT "RideMatch_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
