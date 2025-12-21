import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  MinLength,
  IsString,
  IsDate,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShiftDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Shift name',
    example: 'Shift 1',
  })
  name: string;

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

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({
  //   description: 'Vehicle ID',
  //   example: 'vehicleId',
  // })
  // vehicleId: string;

  // @Transform(({ value }) => {
  //   if (value === 'true') return true;
  //   if (value === 'false') return false;
  //   return value as boolean;
  // })
  // @IsBoolean()
  // @IsNotEmpty()
  // @ApiProperty({
  //   description: 'Is the trip active',
  //   example: true,
  // })
  // isActive: boolean;
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

export class CreateShiftRequestDto {
  @ValidateNested()
  @Type(() => CreateShiftDto)
  @IsNotEmpty()
  @ApiProperty()
  shift: CreateShiftDto;

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
}
