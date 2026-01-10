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
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip origin name',
    example: 'Trip 1',
  })
  originName: string;
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip destination name',
    example: 'Trip 1',
  })
  destinationName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Passenger ID',
    example: 'passengerId',
  })
  passengerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip polyline string',
    example: '-02-3949rr0w=f[e',
  })
  polylineString: string;

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
  maxWalkMeters?: number;
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

export class CreateTripRequestDto {
  @ValidateNested()
  @Type(() => CreateTripDto)
  @IsNotEmpty()
  @ApiProperty()
  trip: CreateTripDto;

}
