import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TripQueryDto {
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Filter trips by online status',
    example: true,
  })
  active?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'include trip vehicle',
    example: true,
  })
  vehicle?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Filter trips by offline status',
    example: true,
  })
  completed?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Include origin location details',
    example: true,
  })
  origin?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Include destination location details',
    example: true,
  })
  destination?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Include passenger details',
    example: true,
  })
  passenger?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Filter trips by driver ID',
    example: 'driverId',
  })
  driverId?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Filter trips by shift ID',
    example: 'shiftId',
  })
  shiftId?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Filter trips to include shift details',
    example: true,
  })
  shift?: boolean;
}

export class MatchTripWithPublicVehicleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Shift ID',
    example: 'shiftId',
  })
  shiftId: string;
}
