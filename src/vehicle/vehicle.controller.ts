import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/auth.decorator';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Roles(Role.DRIVER, Role.ADMIN)
  async createVehicle(@Body() vehicle: CreateVehicleDto) {
    return {
      message: 'Vehicle successfully created',
      success: true,
      data: await this.vehicleService.createVehicle(vehicle),
    };
  }

  @Get()
  @Public()
  async getVehicles() {
    return {
      message: 'Vehicles successfully retrieved',
      success: true,
      data: await this.vehicleService.getVehicles(),
    };
  }

  @Get('user/:id')
  @Public()
  async getVehiclesByUserId(@Param('id') id: string) {
    return {
      message: 'Vehicles successfully retrieved',
      success: true,
      data: await this.vehicleService.getVehiclesByUserId(id),
    };
  }

  @Get(':id')
  @Public()
  async getVehicleById(@Param('id') id: string) {
    return {
      message: 'Vehicle successfully retrieved',
      success: true,
      data: await this.vehicleService.getVehicleById(id),
    };
  }
}
