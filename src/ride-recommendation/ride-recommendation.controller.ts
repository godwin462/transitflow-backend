import { Controller, Post, Param, Get } from '@nestjs/common';
import { RideRecommendationService } from './ride-recommendation.service';

@Controller('ride-recommendation')
export class RideRecommendationController {
  constructor(
    private readonly rideRecommendationService: RideRecommendationService,
  ) {}

  @Post('public/:tripId')
  async recommendForTrips(@Param('tripId') tripId: string) {
    const matches =
      await this.rideRecommendationService.recommendPublicRides(tripId);
    return {
      message: matches[0] ? 'Matches found' : 'No matches found',
      success: true,
      data: matches,
    };
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
