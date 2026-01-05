import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TripQueryDto } from './dto/trip-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CreateLocationDto,
  CreateTripDto,
  LatLngDto,
} from './dto/create-trip.dto';
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
        origin: query.origin != undefined,
        destination: query.destination != undefined,
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
	  *,
	  ST_AsGeoJSON(route)::json as route
	FROM "Trip"
  `;
  }

  async createTrip(
    passengerId: string,
    tripPayload: CreateTripDto,
    originPayload: CreateLocationDto,
    destinationPayload: CreateLocationDto,
    polyline: LatLngDto[],
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
          OR: [
            {
              passengerId,
              status: 'active',
            },
            {
              passengerId,
              status: 'started',
            },
          ],
        },
      });
      if (activeTrip) {
        throw new BadRequestException(
          'You currently have an active trip, please end the current trip',
        );
      }
      const trip = await this.prisma.trip.create({
        data: {
          ...tripPayload,
          passengerId,
          origin: {
            create: { ...originPayload, userId: passengerId },
          },
          destination: {
            create: { ...destinationPayload, userId: passengerId },
          },
        },
      });
      await this.prisma.$executeRaw`
  UPDATE "Trip"
  SET route = ST_LineFromEncodedPolyline(${polyline})

  WHERE id = ${trip.id}
`;
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

      const trip = await this.prisma.trip.update({
        where: { id: tripId },
        data: payload,
        include: {
          origin: query.origin != undefined,
          destination: query.destination != undefined,
        },
      });
      if (payload.route) {
        await this.prisma.$executeRaw`
  UPDATE "Trip"
  SET route = ST_LineFromEncodedPolyline(${payload.route})

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
        OR: [
          { status: query.active ? 'active' : undefined },
          { status: query.completed ? 'completed' : undefined },
        ],
      },
      include: {
        origin: query.origin != undefined,
        destination: query.destination != undefined,
      },
    });
  }

  async getActivePassengerTrip(passengerId: string, query: TripQueryDto) {
    // console.log(passengerId, `Getting passengers trips with query:`, query);
    return await this.prisma.trip.findFirst({
      where: {
        passengerId,
        OR: [
          { status: 'pending' },
          { status: 'active' },
          { status: 'started' },
        ],
        // NOT: { vehicleId: null },
      },
      include: {
        origin: query.origin != undefined,
        destination: query.destination != undefined,
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
        OR: [
          { status: query.active ? 'active' : undefined },
          { status: query.completed ? 'completed' : undefined },
        ],
      },
      include: {
        origin: query.origin != undefined,
        destination: query.origin != undefined,
      },
    });
  }
}
