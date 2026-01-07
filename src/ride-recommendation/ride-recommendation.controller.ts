import { Controller, Post, Param, Get } from '@nestjs/common';
import { RideRecommendationService } from './ride-recommendation.service';

@Controller('ride-recommendation')
export class RideRecommendationController {
  constructor(
    private readonly rideRecommendationService: RideRecommendationService,
  ) {}

  @Post('find-trip-rides/:tripId')
  async recommendForTrips(@Param('tripId') tripId: string) {
    return await this.rideRecommendationService.recommendForTrips(tripId);
  }

  @Get('all-recommendations')
  async getAllRecommendations() {
    return {
      message: 'Recommendations found',
      success: true,
      data: await this.rideRecommendationService.getAllRecommendations(),
    };
  }
}
