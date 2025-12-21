import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto, CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async getShiftById(id: string) {
    return this.prisma.shift.findUnique({
      where: { id },
      include: {
        origin: true,
        destination: true,
      },
    });
  }

  async getShifts() {
    return this.prisma.shift.findMany({
      include: {
        origin: true,
        destination: true,
      },
    });
  }

  async createShift(
    driverId: string,
    shiftPayload: CreateShiftDto,
    originPayload: CreateLocationDto,
    destinationPayload: CreateLocationDto,
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
        throw new NotFoundException('Vehicle not found');
      }
      const activeShift = await this.prisma.shift.findFirst({
        where: {
          driverId,
          status: 'active',
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
          // driverId,
          origin: {
            create: { ...originPayload, userId: driverId },
          },
          destination: {
            create: { ...destinationPayload, userId: driverId },
          },
        },
      });
      return shift;
    } catch (error) {
      console.log('Create shift error: ', error);
      throw error;
    }
  }

  async updateShift(shiftId: string, payload: UpdateShiftDto) {
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
          origin: true,
          destination: true,
        },
      });
      return shift;
    } catch (error) {
      console.log('Update shift error: ', error);
      throw error;
    }
  }
}
