import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import {
  MatchTripWithPublicVehicleDto,
  TripQueryDto,
} from './dto/trip-query.dto';
import { Public } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('trip')
class TripController {
  constructor(private readonly tripService: TripService) {}

  @Roles('passenger')
  @Post()
  async createTrip(
    @Body() payload: CreateTripDto,
    @Query() query: TripQueryDto,
  ) {
    // console.log(payload);
    return {
      message: 'Trip creates successfully',
      success: true,
      data: await this.tripService.createTrip(
        payload.passengerId,
        payload,
        query,
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
    return {
      message: 'Trip fetched successfully',
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
    return {
      message: 'Trip fetched successfully',
      success: true,
      data: await this.tripService.getTripByPassengerId(passengerId, query),
    };
  }

  @Roles('passenger')
  @Patch('passenger/public/match-vehicle/:tripId')
  async matchPassengerTripWithPublicVehicle(
    @Param('tripId') tripId: string,
    @Body() payload: MatchTripWithPublicVehicleDto,
  ) {
    return {
      message: 'Trip matched successfully',
      success: true,
      data: await this.tripService.matchPassengerTripWithPublicVehicle(
        tripId,
        payload.shiftId,
      ),
    };
  }

  @Roles('passenger')
  @Patch('passenger/cancel-trip/:tripId')
  async cancelPassengerTrip(@Param('tripId') tripId: string) {
    return {
      message: 'Trip cancelled successfully',
      success: true,
      data: await this.tripService.cancelTrip(tripId),
    };
  }

  @Roles('passenger')
  @Patch('passenger/request-dropoff/:tripId')
  async requestDropoffPassengerTrip(@Param('tripId') tripId: string) {
    return {
      message: 'Dropoff requested successfully',
      success: true,
      data: await this.tripService.requestDropoffPassengerTrip(tripId),
    };
  }
}

export default TripController;
