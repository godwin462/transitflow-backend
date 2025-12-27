import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShiftQueryDto } from 'src/shift/dto/shift-query.dto';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getDriverShiftHistory(driverId: string, query: ShiftQueryDto) {
    const history = await this.prisma.shift.findMany({
      where: {
        driverId,
        // NOT: { OR: [{ status: 'active' }, { status: 'on_break' }] },
        status: { notIn: ['active', 'on_break'] },
      },
      include: {
        origin: query.origin ? true : false,
        destination: query.destination ? true : false,
        vehicle: query.vehicle ? true : false,
      },
    });
    return history;
  }
}
