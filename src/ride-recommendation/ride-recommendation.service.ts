import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

// Geometry returned by Pg/pg: could be Buffer, string (EWKT/GeoJSON), or an object.
// Be conservative and allow the common cases.

@Injectable()
export class RideRecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async recommendPublicRides(tripId: string) {
    // 1️⃣ Ensure trip exists
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    // 2️⃣ Run geospatial recommendation query
    const matches = await this.prisma.$queryRawUnsafe<RawMatch[]>(
      `
      WITH trip_data AS (
        SELECT
          t.id AS trip_id,
          t."originPoint",
          t."destinationPoint",
          t."maxWalkMeters"
        FROM "Trip" t
        WHERE t.id = $1
      ),

      candidate_shifts AS (
        SELECT
          s.id AS shift_id,
          r.geometry AS route,
          v."licensePlate" AS vehicle_license_plate
        FROM "Shift" s
            Left Join "Vehicle" v ON v.id = s."vehicleId"
        JOIN "Route" r ON r.id = s."routeId"
        WHERE s.status = 'online'
      ),

      matched AS (
        SELECT
          cs.shift_id,
          cs.vehicle_license_plate,
          ST_ClosestPoint(cs.route, td."originPoint") AS pickup_point,
          ST_ClosestPoint(cs.route, td."destinationPoint") AS dropoff_point,

          ST_LineLocatePoint(cs.route, ST_ClosestPoint(cs.route, td."originPoint")) AS pickup_fraction,
          ST_LineLocatePoint(cs.route, ST_ClosestPoint(cs.route, td."destinationPoint")) AS dropoff_fraction,

          ST_Distance(td."originPoint", ST_ClosestPoint(cs.route, td."originPoint")) AS pickup_walk_meters,
          ST_Distance(td."destinationPoint", ST_ClosestPoint(cs.route, td."destinationPoint")) AS dropoff_walk_meters

        FROM candidate_shifts cs
        CROSS JOIN trip_data td
      )

      SELECT
        shift_id,
        pickup_point,
        dropoff_point,
        pickup_fraction,
        dropoff_fraction,
        pickup_walk_meters,
        dropoff_walk_meters,
        vehicle_license_plate,
        (
          pickup_walk_meters +
          dropoff_walk_meters +
          (1 - (dropoff_fraction - pickup_fraction)) * 1000
        ) AS score
      FROM matched
      WHERE
        pickup_walk_meters <= (SELECT "maxWalkMeters" FROM trip_data)
        AND dropoff_walk_meters <= (SELECT "maxWalkMeters" FROM trip_data)
        AND pickup_fraction < dropoff_fraction
      ORDER BY score
      LIMIT 20;
    `,
      tripId,
    );

    // 3️⃣ Persist RideMatch rows using raw SQL (Prisma omits .create for geometry models)
    await this.prisma.$transaction(
      matches.map(
        (m) =>
          this.prisma.$executeRaw`
          INSERT INTO "RideMatch" (
            "id", "tripId", "shiftId",
            "pickupPoint", "dropoffPoint",
            "pickupFraction", "dropoffFraction",
            "pickupWalkMeters", "dropoffWalkMeters",
            "score", "status",
            "estimatedPickupTime", "estimatedDropoffTime", "createdAt"
          ) VALUES (
            ${randomUUID()}, ${tripId}, ${m.shift_id},
            ${m.pickup_point}::geometry, ${m.dropoff_point}::geometry,
            ${m.pickup_fraction}::float8, ${m.dropoff_fraction}::float8,
            ${m.pickup_walk_meters}::float8, ${m.dropoff_walk_meters}::float8,
            ${m.score}::float8, 'proposed'::"RideMatchStatus",
            NOW(), NOW(), NOW()
          )
        `,
      ),
    );

    return matches;
  }

  async getAllRecommendations() {
    return this.prisma.rideMatch.findMany();
  }
}
