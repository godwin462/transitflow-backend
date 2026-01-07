import { Module } from '@nestjs/common';
import { RideRecommendationService } from './ride-recommendation.service';
import { RideRecommendationController } from './ride-recommendation.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RideRecommendationController],
  providers: [RideRecommendationService, PrismaService],
})
export class RideRecommendationModule {}
