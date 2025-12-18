import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { VehicleCategory, VehicleSize } from 'generated/prisma/enums';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Make of the vehicle' })
  make: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Model of the vehicle' })
  model: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Year of the vehicle' })
  year: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Color of the vehicle' })
  color: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'License plate number of the vehicle',
  })
  licensePlate: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Maximum passenger capacity of the vehicle',
  })
  capacity: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Vehicle Identification Number of the vehicle',
  })
  vin: string;

  @IsEnum(VehicleCategory)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Category of the vehicle',
  })
  category: VehicleCategory;

  @IsEnum(VehicleSize)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Category of the vehicle',
  })
  size: VehicleSize;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Is the vehicle public',
  })
  isPublic: boolean;
}
