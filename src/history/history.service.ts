import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShiftQueryDto } from 'src/shift/dto/shift-query.dto';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getDriverShiftHistory(driverId: string, query: ShiftQueryDto) {
    return this.prisma.shift.findMany({
      where: {
        driverId,
        // NOT: { OR: [{ status: 'active' }, { status: 'on_break' }] },
        status: { notIn: ['online', 'offline'] },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        route: !!query.route,
        vehicle: !!query.vehicle,
      },
    });
  }

  async getPassengerTripHistory(passengerId: string, query: ShiftQueryDto) {
    return this.prisma.trip.findMany({
      where: {
        passengerId,
        status: {
          in: ['completed', 'cancelled'],
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        vehicle: !!query.vehicle,
      },
    });
  }
}
