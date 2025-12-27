import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftRequestDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftQueryDto } from './dto/shift-query.dto';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  async createShift(@Body() payload: CreateShiftRequestDto) {
    // console.log(payload);
    return {
      message: 'Shift creates successfully',
      success: true,
      data: await this.shiftService.createShift(
        payload.shift.driverId,
        payload.shift,
        payload.origin,
        payload.destination,
      ),
    };
  }

  @Put(':id')
  async updateShift(
    @Param('id') shiftId: string,
    @Body() payload: UpdateShiftDto,
    @Query() query: ShiftQueryDto,
  ) {
    return {
      message: 'Shift updated successfully',
      success: true,
      data: await this.shiftService.updateShift(shiftId, payload, query),
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
  async getShiftById(
    @Param('id') shiftId: string,
    @Query() query: ShiftQueryDto,
  ) {
    return {
      message: 'Shift fetched successfully',
      success: true,
      data: await this.shiftService.getShiftById(shiftId, query),
    };
  }

  @Get('driver/:id')
  async getShiftByDriverId(
    @Param('id') driverId: string,
    @Query() query: ShiftQueryDto,
  ) {
    return {
      message: 'Shifts fetched successfully',
      success: true,
      data: await this.shiftService.getShiftByDriverId(driverId, query),
    };
  }
}
