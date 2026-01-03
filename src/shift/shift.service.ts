import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateLocationDto,
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
        origin: query.origin ? true : false,
        destination: query.destination ? true : false,
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
      *,
      ST_AsGeoJSON(route)::json as route
    FROM "Shift"
  `;
  }

  async createShift(
    driverId: string,
    shiftPayload: CreateShiftDto,
    originPayload: CreateLocationDto,
    destinationPayload: CreateLocationDto,
    polyline: LatLngDto[],
  ) {
    try {
      const driver = await this.prisma.user.findUnique({
        where: { id: driverId },
      });
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { userId: driverId },
      });
      if (!vehicle) {
        throw new NotFoundException('Registered vehicle not found for driver');
      }
      const activeShift = await this.prisma.shift.findFirst({
        where: {
          OR: [
            {
              driverId,
              status: 'online',
            },
            {
              driverId,
              status: 'offline',
            },
          ],
        },
      });
      if (activeShift) {
        throw new BadRequestException(
          'Driver currently have an active shift, please end the current shift',
        );
      }
      const shift = await this.prisma.shift.create({
        data: {
          ...shiftPayload,
          vehicleId: vehicle.id,
          driverId,
          origin: {
            create: { ...originPayload, userId: driverId },
          },
          destination: {
            create: { ...destinationPayload, userId: driverId },
          },
        },
      });
      await this.prisma.$executeRaw`
  UPDATE "Shift"
  SET route = ST_LineFromEncodedPolyline(${polyline})

  WHERE id = ${shift.id}
`;
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
      const shiftExists = await this.prisma.shift.findUnique({
        where: { id: shiftId },
      });

      if (!shiftExists) {
        throw new NotFoundException('Shift not found');
      }

      const shift = await this.prisma.shift.update({
        where: { id: shiftId },
        data: payload,
        include: {
          origin: query.origin,
          destination: query.destination,
        },
      });
      if (payload.route) {
        await this.prisma.$executeRaw`
  UPDATE "Shift"
  SET route = ST_LineFromEncodedPolyline(${payload.route})

  WHERE id = ${shift.id}
`;
      }

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
        origin: query.origin ? true : false,
        destination: query.destination ? true : false,
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
        origin: query.origin ? true : false,
        destination: query.origin ? true : false,
      },
    });
  }
}
