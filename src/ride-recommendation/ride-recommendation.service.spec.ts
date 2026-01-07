import { Test, TestingModule } from '@nestjs/testing';
import { RideRecommendationService } from './ride-recommendation.service';

describe('RideRecommendationService', () => {
  let service: RideRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RideRecommendationService],
    }).compile();

    service = module.get<RideRecommendationService>(RideRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
