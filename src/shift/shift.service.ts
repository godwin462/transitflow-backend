import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateLocationDto,
  CreateRouteDto,
  CreateShiftDto,
  LatLngDto,
} from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShiftQueryDto } from './dto/shift-query.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async getShiftById(id: string, query: ShiftQueryDto) {
    // console.log(id, 'Query params: ', query);
    const shift = await this.prisma.shift.findUnique({
      where: {
        id,
      },
      include: {
        route: query.route ? true : false,
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
      ST_AsGeoJSON(r.geometry)::json as route
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

      await this.prisma.$transaction(async (tx) => {
        // 1. Create Route
        await tx.$executeRaw`
          INSERT INTO "Route" (
            id, name, geometry, "lengthMeters", "createdAt"
          ) VALUES (
            ${routeId}, ${route.name}, ST_LineFromEncodedPolyline(${route.geometry}), ${route.lengthMeters}, NOW()
          )
        `;

        // 2. Create Shift
        await tx.$executeRaw`
          INSERT INTO "Shift" (
            id, name, "startTime", "endTime", status, "driverId", "vehicleId", "routeId", "createdAt", "updatedAt"
          ) VALUES (
            ${shiftId}, ${shiftPayload.name}, ${shiftPayload.startTime}, ${shiftPayload.endTime}, 'online'::"ShiftStatus", ${driverId}, ${driver.vehicle!.id}, ${routeId}, NOW(), NOW()
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
    return this.prisma.shift.findFirst({
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
}
