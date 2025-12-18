import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { VehicleCategory, VehicleSize } from 'generated/prisma/enums';

export class CreateVehicleDto {
  @IsString()
  @ApiProperty({ required: true, description: 'User ID' })
  userId: string;

  @IsString()
  @ApiProperty({ required: true, description: 'Make of the vehicle' })
  make: string;

  @IsString()
  @ApiProperty({ required: true, description: 'Model of the vehicle' })
  model: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @ApiProperty({ required: true, description: 'Year of the vehicle' })
  year: number;

  @IsString()
  @ApiProperty({ required: true, description: 'Color of the vehicle' })
  color: string;

  @IsString()
  @ApiProperty({
    required: true,
    description: 'License plate number of the vehicle',
  })
  licensePlate: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({
    required: true,
    description: 'Maximum passenger capacity of the vehicle',
  })
  capacity: number;

  @IsString()
  @ApiProperty({
    required: true,
    description: 'Vehicle Identification Number of the vehicle',
  })
  vin: string;

  @IsEnum(VehicleCategory)
  @ApiProperty({ required: true, description: 'Category of the vehicle' })
  category: VehicleCategory;

  @IsEnum(VehicleSize)
  @ApiProperty({ required: true, description: 'Size of the vehicle' })
  size: VehicleSize;

  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ required: true, description: 'Is the vehicle public' })
  isPublic: boolean;
}
