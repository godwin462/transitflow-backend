import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { VehicleCategory } from 'generated/prisma/enums';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'User ID' })
  userId: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Make of the vehicle' })
  make: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Model of the vehicle' })
  model: string;
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
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Is the vehicle public',
  })
  isPublic: boolean;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Is the vehicle verified on the platform',
  })
  isVerified: boolean;
}
