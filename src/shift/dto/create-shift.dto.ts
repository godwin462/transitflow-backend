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
} from 'class-validator';
import { Type } from 'class-transformer';

export class LatLngDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @ApiProperty({
    description: 'Latitude',
    example: 37.7749,
  })
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @ApiProperty({
    description: 'Longitude',
    example: -122.4194,
  })
  longitude: number;
}

export class CreateShiftDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Shift name',
    example: 'Shift 1',
  })
  name: string;
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Shift origin name',
    example: 'Shift 1',
  })
  originName: string;
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Shift destination name',
    example: 'Shift 1',
  })
  destinationName: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Shift start time',
    example: '2022-01-01T00:00:00.000Z',
  })
  startTime: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({
    description: 'Shift end time',
    example: '2022-01-01T00:00:00.000Z',
  })
  endTime: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Driver ID',
    example: 'driverId',
  })
  driverId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Vehicle ID',
    example: 'vehicleId',
  })
  vehicleId: string;

  @Type(() => LatLngDto)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Origin of the route',
    example: { latitude: 37.7749, longitude: -122.4194 },
  })
  origin: LatLngDto;

  @Type(() => LatLngDto)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Destination of the route',
    example: { latitude: 37.7749, longitude: -122.4194 },
  })
  destination: LatLngDto;
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
}

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Route name',
    example: 'Main Route',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Encoded Polyline string',
    example: 'u{~vFvyys@fGe}',
  })
  geometry: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Length of the route in meters',
    example: 12345,
  })
  lengthMeters: number;
}

export class CreateShiftRequestDto {
  @ValidateNested()
  @Type(() => CreateShiftDto)
  @IsNotEmpty()
  @ApiProperty()
  shift: CreateShiftDto;

  @ValidateNested()
  @Type(() => CreateRouteDto)
  @IsNotEmpty()
  @ApiProperty()
  route: CreateRouteDto;
}
