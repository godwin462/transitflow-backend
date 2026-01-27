import { Module } from '@nestjs/common';
import TripController from './trip.controller';
import { TripService } from './trip.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OtpService } from 'src/otp/otp.service';

@Module({
  controllers: [TripController],
  providers: [TripService, PrismaService, OtpService],
})
export class TripModule {}
