import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripRequestDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripQueryDto } from './dto/trip-query.dto';
import { Public } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Roles('passenger')
  @Post()
  async createTrip(@Body() payload: CreateTripRequestDto) {
    return {
      message: 'Trip creates successfully',
      success: true,
      data: await this.tripService.createTrip(
        payload.trip.passengerId,
        payload.trip,
        payload.origin,
        payload.destination,
        payload.route,
      ),
    };
  }

  @Put(':id')
  async updateTrip(
    @Param('id') tripId: string,
    @Body() payload: UpdateTripDto,
    @Query() query: TripQueryDto,
  ) {
    return {
      message: 'Trip updated successfully',
      success: true,
      data: await this.tripService.updateTrip(tripId, payload, query),
    };
  }

  @Get()
  @Public()
  async getTrips() {
    return {
      message: 'Trips fetched successfully',
      success: true,
      data: await this.tripService.getTrips(),
    };
  }

  @Get(':id')
  async getTripById(@Param('id') tripId: string, @Query() query: TripQueryDto) {
    return {
      message: 'Trip fetched successfully',
      success: true,
      data: await this.tripService.getTripById(tripId, query),
    };
  }

  @Roles('passenger')
  @Get('passenger/active-trip')
  async getActivePassengerTrip(
    @Req() req: RequestWithUser,
    @Query() query: TripQueryDto,
  ) {
    console.log(req.user, `Getting passengers trips with query:`, query);
    return {
      message: 'Trips fetched successfully',
      success: true,
      data: await this.tripService.getActivePassengerTrip(req.user.id, query),
    };
  }

  @Roles('passenger')
  @Get('passenger/:id')
  async getTripByPassengerId(
    @Param('id') passengerId: string,
    @Query() query: TripQueryDto,
  ) {
    // console.log(passengerId, `Getting passengers trips with query:`, query);
    return {
      message: 'Trips fetched successfully',
      success: true,
      data: await this.tripService.getTripByPassengerId(passengerId, query),
    };
  }
}
