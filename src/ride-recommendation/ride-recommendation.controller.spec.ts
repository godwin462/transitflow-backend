import { Test, TestingModule } from '@nestjs/testing';
import { RideRecommendationController } from './ride-recommendation.controller';

describe('RideRecommendationController', () => {
  let controller: RideRecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideRecommendationController],
    }).compile();

    controller = module.get<RideRecommendationController>(RideRecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
