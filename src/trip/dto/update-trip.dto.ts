import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  TransportMode,
  TripStatus,
  VehicleCategory,
} from 'generated/prisma/enums';
import { LatLngDto } from './create-trip.dto';

export class UpdateTripDto {
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Trip end time',
    example: '2022-01-01T00:00:00.000Z',
  })
  endTime?: Date;

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

  @IsEnum(VehicleCategory)
  @IsOptional()
  @ApiProperty({
    description: 'Vehicle category',
    example: 'bus',
  })
  vehicleType?: VehicleCategory;

  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty({
    description: 'Vehicle ID',
    example: '89834uuu48',
  })
  vehicleId?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LatLngDto)
  @ApiProperty({
    description: 'Decoded Polyline string',
    example: 'Trip route from origin to destination',
  })
  route?: LatLngDto[];
}
