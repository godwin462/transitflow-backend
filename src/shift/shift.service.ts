import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRouteDto, CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { Prisma } from 'generated/prisma/client';
import { OtpService } from 'src/otp/otp.service';
import { PickupDto } from './dto/pickup.dto';

type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};

type GeoLineString = {
  type: 'LineString';
  coordinates: [number, number][];
};

type RouteRecord = {
  id: string;
  name: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: 'online' | 'offline' | string; // extend as needed
  driverId: string;
  vehicleId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  routeId: string;
  destination: GeoPoint;
  origin: GeoPoint;
  route: GeoLineString;
};

@Injectable()
export class ShiftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
  ) {}

  async getShiftById(id: string, query: ShiftQueryDto) {
    // console.log(id, 'Query params: ', query);
    const shift = await this.prisma.shift.findUnique({
      where: {
        id,
      },
      include: {
        route: !!query.route,
        vehicle: !!query.vehicle,
        driver: !!query.driver,
        trips: query.trips
          ? query.passenger
            ? { include: { passenger: true } }
            : true
          : false,
      },
    });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    return shift;
  }

  async getShifts() {
    return this.prisma.$queryRaw`
    SELECT
      s.*,
      r."polylineString",
      ST_AsGeoJSON(ST_Transform(s.origin, 4326))::json as origin,
      ST_AsGeoJSON(ST_Transform(s.destination, 4326))::json as destination,
      ST_AsGeoJSON(ST_Transform(ST_SetSRID(r.geometry, 3857), 4326))::json as route
    FROM "Shift" s
    JOIN "Route" r ON s."routeId" = r.id
  `;
  }

  async createShift(
    driverId: string,
    shiftPayload: CreateShiftDto,
    route: CreateRouteDto,
  ) {
    try {
      const driver = await this.prisma.user.findUnique({
        where: { id: driverId },
        include: {
          vehicle: true,
        },
      });
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }
      if (!driver.vehicle) {
        throw new NotFoundException('Registered vehicle not found for driver');
      }
      const activeShift = await this.prisma.shift.findFirst({
        where: {
          driverId,
          status: 'online',
        },
      });
      if (activeShift) {
        throw new BadRequestException(
          'Driver currently have an active shift, please end the current shift',
        );
      }
      const shiftId = randomUUID();
      const routeId = randomUUID();
      const ticket = this.otpService.generateTicket(driver);

      await this.prisma.$transaction(async (tx) => {
        // 1. Create Route
        await tx.$executeRaw`
          INSERT INTO "Route" (
            id, name, geometry, "polylineString", "lengthMeters", "createdAt"
          ) VALUES (
            ${routeId}, ${route.name}, ST_LineFromEncodedPolyline(${route.geometry}), ${route.geometry}, ${route.lengthMeters}, NOW()
          )
        `;

        // 2. Create Shift
        await tx.$executeRaw`
          INSERT INTO "Shift" (
            id, name,"originName","destinationName", "ticket", "startTime", "endTime", status, "driverId", "vehicleId", "routeId", "createdAt", "updatedAt", "origin", "destination"
          ) VALUES (
            ${shiftId}, ${shiftPayload.name},${shiftPayload.originName},${shiftPayload.destinationName}, ${ticket}, ${shiftPayload.startTime}, ${shiftPayload.endTime}, 'online'::"ShiftStatus", ${driverId}, ${driver.vehicle!.id}, ${routeId}, NOW(), NOW(),
            ST_SetSRID(ST_MakePoint(${shiftPayload.origin.longitude}, ${shiftPayload.origin.latitude}), 4326),
            ST_SetSRID(ST_MakePoint(${shiftPayload.destination.longitude}, ${shiftPayload.destination.latitude}), 4326)
          )
        `;
      });

      const shift = await this.prisma.shift.findUnique({
        where: { id: shiftId },
        include: {
          route: true,
        },
      });
      return shift;
    } catch (error) {
      console.log('Create shift error: ', error);
      throw error;
    }
  }

  async updateShift(
    shiftId: string,
    payload: UpdateShiftDto,
    query: ShiftQueryDto,
  ) {
    try {
      const { route, ...updateData } = payload;
      const shiftExists = await this.prisma.shift.findUnique({
        where: { id: shiftId },
      });

      if (!shiftExists) {
        throw new NotFoundException('Shift not found');
      }

      if (
        shiftExists.status === 'ended' ||
        shiftExists.status === 'cancelled'
      ) {
        delete updateData.status;
      }
      await this.prisma.$transaction(async (tx) => {
        // Update standard fields
        await tx.shift.update({
          where: { id: shiftId },
          data: updateData,
        });

        if (route) {
          // Update Route record
          await tx.$executeRaw`
            UPDATE "Route"
            SET
              name = ${route.name},
              geometry = ST_LineFromEncodedPolyline(${route.geometry}),
              "polylineString" = ${route.geometry},
              "lengthMeters" = ${route.lengthMeters}
            WHERE id = ${shiftExists.routeId}
          `;
        }
      });

      const shift = await this.prisma.shift.findUnique({
        where: { id: shiftId },
        include: {
          route: query.route != undefined,
        },
      });

      return shift;
    } catch (error) {
      console.log('Update shift error: ', error);
      throw error;
    }
  }

  async getShiftsByDriverId(driverId: string, query: ShiftQueryDto) {
    return this.prisma.shift.findMany({
      where: {
        driverId,
        OR: [
          { status: query.online ? 'online' : undefined },
          { status: query.offline ? 'offline' : undefined },
        ],
      },
      include: {
        route: query.route != undefined,
      },
    });
  }

  async getShiftByDriverId(driverId: string, query: ShiftQueryDto) {
    const user = await this.prisma.user.findUnique({ where: { id: driverId } });
    if (!user) {
      throw new NotFoundException('Driver not found');
    }
    /* return this.prisma.shift.findFirst({
      where: {
        driverId,
        OR: [
          { status: query.online ? 'online' : undefined },
          { status: query.offline ? 'offline' : undefined },
        ],
      },
      include: {
        route: query.route != undefined,
      },
    }); */

    let statusCondition = 'FALSE';
    if (query.online && query.offline) {
      statusCondition = "s.status IN ('online', 'offline')";
    } else if (query.online) {
      statusCondition = "s.status = 'online'";
    } else if (query.offline) {
      statusCondition = "s.status = 'offline'";
    }

    const shifts: RouteRecord[] = await this.prisma.$queryRaw`
    SELECT
      s.*,
      r.name as "name",
      ST_AsGeoJSON(ST_Transform(s.origin, 4326))::json as origin,
      ST_AsGeoJSON(ST_Transform(s.destination, 4326))::json as destination,
      ST_AsGeoJSON(ST_Transform(ST_SetSRID(r.geometry, 3857), 4326))::json as route
    FROM "Shift" s
    JOIN "Route" r ON s."routeId" = r.id
    WHERE s."driverId" = ${driverId}
      AND ${Prisma.raw(statusCondition)}
  `;
    // console.log(shifts[0].destination.coordinates);
    return shifts[0] ? shifts[0] : null;
  }

  async pickupPassenger(shiftId: string, data: PickupDto) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
    });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    if (shift.status !== 'online') {
      throw new BadRequestException('Driver is not online');
    }
    const tripExists = await this.prisma.trip.findUnique({
      where: { ticket: data.ticket },
    });
    if (!tripExists) {
      throw new NotFoundException('Trip not found');
    }
    if (tripExists.shiftId) {
      throw new BadRequestException('Trip already matched to a ride');
    }
    return this.prisma.trip.update({
      where: { ticket: data.ticket },
      data: { shiftId: shift.id, status: 'boarded' },
      include: {
        shift: true,
        passenger: true,
      },
    });
  }

  async getShiftTrips(shiftId: string, query: ShiftQueryDto) {
    return this.prisma.trip.findMany({
      where: {
        shiftId,
        status: query.tripStatus ? { in: query.tripStatus } : undefined,
      },
      include: {
        passenger: true,
      },
    });
  }

  async dropoffPassenger(shiftId: string, tripId: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
    });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    if (shift.status !== 'online') {
      throw new BadRequestException('Driver is not online');
    }
    const tripExists = await this.prisma.trip.findUnique({
      where: { id: tripId },
    });
    if (!tripExists) {
      throw new NotFoundException('Trip not found');
    }
    if (tripExists.shiftId !== shift.id) {
      throw new BadRequestException('Trip does not belong to this shift');
    }
    if (tripExists.status == 'completed') {
      return tripExists;
    }

    return this.prisma.trip.update({
      where: { id: tripId },
      data: { status: 'completed' },
      include: {
        shift: true,
        passenger: true,
      },
    });
  }
}
