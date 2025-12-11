import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VehicleService, PrismaService],
  controllers: [VehicleController],
})
export class VehicleModule {}
