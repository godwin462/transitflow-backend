import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ShiftStatus } from 'generated/prisma/enums';

export class ShiftQueryDto {
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
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
    return value as boolean; // Returns original value if it's not a boolean string
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
    return value as boolean; // Returns original value if it's not a boolean string
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
    return value as boolean; // Returns original value if it's not a boolean string
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
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter shifts by driver ID',
    example: 'driverId',
  })
  driverId?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter shifts by vehicle ID',
    example: 'vehicleId',
  })
  vehicleId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter shifts to include vehicle details',
    example: 'vehicleId',
  })
  vehicle?: string;
}
