-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('active', 'started', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "status" "TripStatus" NOT NULL DEFAULT 'active';
