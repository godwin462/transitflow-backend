import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { VehicleCategory } from 'generated/prisma/enums';

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
  @IsBoolean()
  @ApiProperty({ required: true, description: 'Is the vehicle public' })
  isPublic: boolean;
}
