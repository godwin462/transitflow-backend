import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TripQueryDto } from './dto/trip-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateLocationDto, CreateTripDto } from './dto/create-trip.dto';
import type { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) {}

  async getTripById(id: string, query: TripQueryDto) {
    // console.log(id, 'Query params: ', query);
    const trip = await this.prisma.trip.findUnique({
      where: {
        id,
      },
      include: {
        vehicle: query.vehicle != undefined,
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
    origin: CreateLocationDto,
    destination: CreateLocationDto,
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
    "id", "name", "passengerId",  "mode", "status",
    "originPoint", "destinationPoint",
    "maxWalkMeters", "vehicleType", 
    "createdAt", "updatedAt"
  ) VALUES (
    ${id}, ${tripPayload.name}, ${passengerId}, ${tripPayload.mode}::"TransportMode", 'pending'::"TripStatus",
    ST_SetSRID(ST_Point(${origin.longitude}, ${origin.latitude}), 4326),
    ST_SetSRID(ST_Point(${destination.longitude}, ${destination.latitude}), 4326),
    ${origin.maxWalkMeters}, ${tripPayload.vehicleType}::"VehicleCategory",  
    NOW(), NOW()
  )
`;
      const trip = await this.prisma.trip.findUnique({
        where: { id },
        include: {
          vehicle: !!query.vehicleId,
        },
      });
      return trip;
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
      const { originPoint, destinationPoint, ...updateData } = payload;
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
    // console.log(passengerId, `Getting passengers trips with query:`, query);
    return await this.prisma.trip.findFirst({
      where: {
        passengerId,
        status: { notIn: ['completed', 'cancelled'] },
        // NOT: { vehicleId: null },
      },
    });
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
}
