import { Controller, Get, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ShiftQueryDto } from 'src/shift/dto/shift-query.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('driver/shift/:driverId')
  async getDriverShiftsHistory(
    @Param('driverId') shiftId: string,
    @Query() query: ShiftQueryDto,
  ) {
    return {
      message: 'Shift fetched successfully',
      success: true,
      data: await this.historyService.getDriverShiftHistory(shiftId, query),
    };
  }
}
