import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TripQueryDto } from './dto/trip-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateTripDto } from './dto/create-trip.dto';
import type { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from 'generated/prisma/browser';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) {}

  async getTripById(id: string, query: TripQueryDto) {
    console.log(query);
    // console.log(id, 'Query params: ', query);
    // const trip: Trip[] = await this.prisma.$queryRaw`
    // SELECT t.*,
    //        ST_AsGeoJSON(ST_Transform(t."originPoint", 4326))::json as "originPoint",
    // ST_AsGeoJSON(ST_Transform(t."destinationPoint", 4326))::json as "destinationPoint"
    // FROM "Trip" t WHERE id = ${id}
    // `;
    // if (!trip || (Array.isArray(trip) && !trip[0])) {
    //   throw new NotFoundException('Trip not found');
    // }
    // return trip[0];
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        shift: query.shift
          ? query.vehicle
            ? { include: { vehicle: true, driver: true } }
            : true
          : false,
        passenger: !!query.passenger,
      },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async getTrips() {
    return this.prisma.$queryRaw`
    SELECT
      *
      FROM "Trip" 
    `;
  }

  async createTrip(
    passengerId: string,
    tripPayload: CreateTripDto,
    query: TripQueryDto,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: passengerId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const activeTrip = await this.prisma.trip.findFirst({
        where: {
          passengerId,
          status: 'started',
        },
      });
      if (activeTrip) {
        throw new BadRequestException(
          'You currently have an active trip, please end the current trip',
        );
      }
      const id = randomUUID();
      await this.prisma.$executeRaw`
  INSERT INTO "Trip" (
    "id", "name", "originName","destinationName", "passengerId",  "mode", "status",
    "originPoint", "destinationPoint", "polylineString",
    "maxWalkMeters",
    "createdAt", "updatedAt"
  ) VALUES (
            ${id}, ${tripPayload.name}, ${tripPayload.originName}, ${tripPayload.destinationName}, ${passengerId}, ${tripPayload.mode}::"TransportMode", 'pending'::"TripStatus",
            ST_SetSRID(ST_Point(${tripPayload.originPoint.longitude}, ${tripPayload.originPoint.latitude}), 4326),
            ST_SetSRID(ST_Point(${tripPayload.destinationPoint.longitude}, ${tripPayload.destinationPoint.latitude}), 4326),
            ${tripPayload.polylineString},
            ${tripPayload.maxWalkMeters},  
            NOW(), NOW()
             )
             `;
      return this.prisma.trip.findUnique({
        where: { id },
        include: {
          shift: !!query.shiftId,
        },
      });
    } catch (error) {
      console.log('Create trip error: ', error);
      throw error;
    }
  }

  async updateTrip(
    tripId: string,
    payload: UpdateTripDto,
    query: TripQueryDto,
  ) {
    try {
      const tripExists = await this.prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!tripExists) {
        throw new NotFoundException('Trip not found');
      }

      switch (tripExists.status) {
        case 'completed':
          throw new BadRequestException('Trip is already completed');
        case 'cancelled':
          throw new BadRequestException('Trip is already cancelled');
        default:
          break;
      }
      const { originPoint, destinationPoint, polylineString, ...updateData } =
        payload;

      const trip = await this.prisma.trip.update({
        where: { id: tripId },
        data: updateData,
      });
      if (originPoint) {
        await this.prisma.$executeRaw`
  UPDATE "Trip"
  SET originPoint = ST_SetSRID(ST_Point(${originPoint.longitude}, ${originPoint.latitude}), 4326),
  WHERE id = ${trip.id}`;
      }
      if (destinationPoint) {
        await this.prisma.$executeRaw`
    UPDATE "Trip"
    SET destinationPoint = ST_SetSRID(ST_Point(${destinationPoint.longitude}, ${destinationPoint.latitude}), 4326)

  WHERE id = ${trip.id}
`;
      }
      if (polylineString) {
        await this.prisma.$executeRaw`
    UPDATE "Trip"
    SET polylineString = ${polylineString}
      WHERE id = ${trip.id}
`;
      }

      return trip;
    } catch (error) {
      console.log('Update trip error: ', error);
      throw error;
    }
  }

  async getTripsByPassengerId(passengerId: string, query: TripQueryDto) {
    return this.prisma.trip.findMany({
      where: {
        passengerId,
        OR: [{ status: query.completed ? 'completed' : undefined }],
      },
    });
  }

  async getActivePassengerTrip(passengerId: string, query: TripQueryDto) {
    const trip: Trip[] = await this.prisma.$queryRaw`
      SELECT t.*,
             ST_AsGeoJSON(ST_Transform(t."originPoint", 4326))::json as "originPoint", ST_AsGeoJSON(ST_Transform(t."destinationPoint", 4326)) ::json as "destinationPoint"
      FROM "Trip" t
      WHERE "passengerId" = ${passengerId}
        AND status NOT IN ('completed', 'cancelled')
    `;
    if (!trip || (Array.isArray(trip) && !trip[0])) {
      throw new NotFoundException('Trip not found');
    }
    return trip[0];
  }

  async getTripByPassengerId(passengerId: string, query: TripQueryDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: passengerId },
    });
    if (!user) {
      throw new NotFoundException('Passenger not found');
    }
    return this.prisma.trip.findFirst({
      where: {
        passengerId,
        OR: [{ status: query.completed ? 'completed' : undefined }],
      },
    });
  }

  async matchPassengerTripWithPublicVehicle(tripId: string, shiftId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        vehicle: true,
      },
    });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    return this.prisma.trip.update({
      where: { id: tripId },
      data: {
        shiftId,
        status: 'matched',
      },
    });
  }
}
