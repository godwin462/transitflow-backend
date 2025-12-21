import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftRequestDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  async createShift(@Body() body: CreateShiftRequestDto) {
    return {
      message: 'Shift creates successfully',
      success: true,
      data: await this.shiftService.createShift(
        body.shift.driverId,
        body.shift,
        body.origin,
        body.destination,
      ),
    };
  }

  @Put(':id')
  async updateShift(
    @Param('id') shiftId: string,
    @Body() payload: UpdateShiftDto,
  ) {
    return {
      message: 'Shift updated successfully',
      success: true,
      data: await this.shiftService.updateShift(shiftId, payload),
    };
  }

  @Get()
  async getShifts() {
    return {
      message: 'Shifts fetched successfully',
      success: true,
      data: await this.shiftService.getShifts(),
    };
  }

  @Get(':id')
  async getShiftById(@Param('id') shiftId: string) {
    return {
      message: 'Shift fetched successfully',
      success: true,
      data: await this.shiftService.getShiftById(shiftId),
    };
  }
}
