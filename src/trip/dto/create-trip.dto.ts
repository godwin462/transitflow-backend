import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  MinLength,
  IsString,
  IsDate,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransportMode, VehicleCategory } from 'generated/prisma/enums';
import { LatLngDto } from 'src/shift/dto/create-shift.dto';

export class CreateTripDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip name',
    example: 'Trip 1',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Passenger ID',
    example: 'passengerId',
  })
  passengerId: string;

  @IsEnum(TransportMode)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Passenger ID',
    example: 'passengerId',
  })
  mode: TransportMode;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Vehicle ID',
    example: 'vehicleId',
  })
  originPoint: LatLngDto;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Vehicle ID',
    example: 'vehicleId',
  })
  destinationPoint: LatLngDto;

  @IsEnum(VehicleCategory)
  @IsOptional()
  @ApiProperty({
    description: 'Vehicle category',
    example: 'car',
  })
  vehicleType?: VehicleCategory;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicle category',
    example: 'car',
  })
  maxWalMeters?: number;
}

export class CreateLocationDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Latitude',
    example: 0,
  })
  latitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Longitude',
    example: 0,
  })
  longitude: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Address',
    example: '123 Main St',
  })
  address: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Maximum walk distance in meters',
    example: 1000,
  })
  maxWalkMeters: number;
}

export class CreateTripRequestDto {
  @ValidateNested()
  @Type(() => CreateTripDto)
  @IsNotEmpty()
  @ApiProperty()
  trip: CreateTripDto;

  @ValidateNested()
  @Type(() => CreateLocationDto)
  @IsNotEmpty()
  @ApiProperty()
  origin: CreateLocationDto;

  @ValidateNested()
  @Type(() => CreateLocationDto)
  @IsNotEmpty()
  @ApiProperty()
  destination: CreateLocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LatLngDto)
  @ApiProperty({
    description: 'Decoded origin to destination Polyline string',
    example: 'Trip route from origin to destination',
  })
  route: LatLngDto[];
}
