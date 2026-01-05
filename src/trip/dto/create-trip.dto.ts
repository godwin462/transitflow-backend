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
import { TransportMode } from 'generated/prisma/enums';

export class CreateTripDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip name',
    example: 'Trip 1',
  })
  name: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip start time',
    example: '2022-01-01T00:00:00.000Z',
  })
  startTime: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({
    description: 'Trip end time',
    example: '2022-01-01T00:00:00.000Z',
  })
  endTime?: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Driver ID',
    example: 'passengerId',
  })
  passengerId: string;

  @IsEnum(TransportMode)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Transport mode',
    example: 'public',
  })
  mode: TransportMode;
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
    description: 'Decoded Polyline string',
    example: 'Trip route from origin to destination',
  })
  route: LatLngDto[];
}
