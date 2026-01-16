import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  TransportMode,
  TripStatus,
  TripVehicleCategory,
} from 'generated/prisma/enums';
import { LatLngDto } from 'src/shift/dto/create-shift.dto';

export class UpdateTripDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Trip polyline string',
    example: '-02-3949rr0w=f[e',
  })
  polylineString?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Vehicle ID',
    example: '89834uuu48',
  })
  vehicleId?: string;

  @IsEnum(TripVehicleCategory)
  @IsOptional()
  @ApiProperty({
    description: 'Vehicle type',
    example: 'bus',
  })
  vehicleType?: 'car';

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    description: 'Earliest start time',
    example: '2022-01-01T00:00:00.000Z',
  })
  earliestStart?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    description: 'Latest start time',
    example: '2022-01-01T00:00:00.000Z',
  })
  latestStart?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Maximum walk distance in meters',
    example: 1000,
  })
  maxWalkMeters?: number;

  @IsEnum(TripStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Trip status',
    example: 'active',
  })
  status?: TripStatus;

  @IsEnum(TransportMode)
  @IsOptional()
  @ApiProperty({
    description: 'Trip mode',
    example: 'public',
  })
  mode?: TransportMode;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LatLngDto)
  @ApiProperty({
    description: 'Decoded Polyline string',
    example: 'Trip route from origin to destination',
  })
  route?: LatLngDto[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => LatLngDto)
  @ApiProperty({
    description: 'Origin point',
    example: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  })
  originPoint?: LatLngDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => LatLngDto)
  @ApiProperty({
    description: 'Destination point',
    example: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  })
  destinationPoint?: LatLngDto;
}
