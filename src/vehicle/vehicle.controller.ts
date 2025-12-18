import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/auth.decorator';
import { imageUploadOptions } from 'src/common/image-upload/image-upload-options';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/common/image-upload/size-validation';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Roles(Role.driver, Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5, imageUploadOptions))
  async createVehicle(
    @Body() vehicle: CreateVehicleDto,
    @UploadedFiles(new FileSizeValidationPipe()) files: Express.Multer.File[],
  ) {
    // console.log(files);
    // return { message: 'testing file upload' };
    return {
      message: 'Vehicle successfully created',
      success: true,
      data: await this.vehicleService.createVehicle(vehicle, files),
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

  @Get('driver/:id')
  @Public()
  async getVehicleByUserId(@Param('id') id: string) {
    return {
      message: 'Vehicle successfully retrieved',
      success: true,
      data: await this.vehicleService.getVehicleByUserId(id),
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

  @Put(':id')
  @Roles(Role.driver, Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5, imageUploadOptions))
  async updateVehicleById(
    @Param('id') id: string,
    @Body() vehicle: UpdateVehicleDto,
    @UploadedFiles(new FileSizeValidationPipe()) files: Express.Multer.File[],
  ) {
    return {
      message: 'Vehicle successfully updated',
      success: true,
      data: await this.vehicleService.updateVehicleById(id, vehicle, files),
    };
  }

  @Delete(':id')
  @Roles(Role.driver, Role.admin)
  async deleteVehicleById(@Param('id') id: string) {
    return {
      message: 'Vehicle successfully deleted',
      success: true,
      data: await this.vehicleService.deleteVehicleById(id),
    };
  }
}
