import { Controller, Get, Query, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ShiftQueryDto } from 'src/shift/dto/shift-query.dto';
import { TripQueryDto } from 'src/trip/dto/trip-query.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('driver/shifts/')
  async getDriverShiftsHistory(
    @Req() req: RequestWithUser,
    @Query() query: ShiftQueryDto,
  ) {
    return {
      message: 'Shift fetched successfully',
      success: true,
      data: await this.historyService.getDriverShiftHistory(req.user.id, query),
    };
  }

  @Get('passenger/trips/')
  async getPassengerTripHistory(
    @Req() req: RequestWithUser,
    @Query() query: TripQueryDto,
  ) {
    return {
      message: 'Trip fetched successfully',
      success: true,
      data: await this.historyService.getPassengerTripHistory(
        req.user.id,
        query,
      ),
    };
  }
}
