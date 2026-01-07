import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const staticId = 'cmjwmc7yi00008sj7lqg9pl8f';

@Injectable()
export class RideRecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async recommendForTrips(tripId: string) {
    // 1️⃣ Ensure trip exists
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true },
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    // 2️⃣ Run geospatial recommendation query
    const matches = await this.prisma.$queryRawUnsafe<any[]>(
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
          r.geometry AS route
        FROM "Shift" s
        JOIN "Route" r ON r.id = s."routeId"
        WHERE s.status = 'online'
      ),

      matched AS (
        SELECT
          cs.shift_id,
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

    // 4️⃣ Return original or fetched matches (returning number of rows for now or any required data)
    return {
      message: matches[0] ? 'Matches found' : 'No matches found',
      success: true,
      data: matches,
    };
  }

  async getAllRecommendations() {
    return this.prisma.rideMatch.findMany();
  }
}
