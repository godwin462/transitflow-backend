import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ShiftStatus, TripStatus } from 'generated/prisma/enums';

export class ShiftQueryDto {
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Filter shifts by online status',
    example: ShiftStatus.online,
  })
  online?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Filter shifts by offline status',
    example: ShiftStatus.online,
  })
  offline?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Filter shifts by driver inclusion',
    example: true,
  })
  driver?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Include route details',
    example: ShiftStatus.online,
  })
  route?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Filter shifts by driver ID',
    example: true,
  })
  driverId?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Include trips',
    example: true,
  })
  trips?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Include vehicle',
    example: true,
  })
  vehicle?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Filter shifts by passenger inclusion',
    example: true,
  })
  passenger?: boolean;

  @IsOptional()
  @IsEnum(ShiftStatus)
  @ApiProperty({
    description: 'Filter shifts by status',
    example: ShiftStatus.online,
  })
  status?: ShiftStatus;

  @IsOptional()
  @IsEnum(TripStatus)
  @ApiProperty({
    description: 'Filter trips by status',
    example: TripStatus.pending,
  })
  tripStatus?: TripStatus;
}
