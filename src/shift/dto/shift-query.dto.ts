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
    description: 'Filter shifts by active status',
    example: ShiftStatus.active,
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
    description: 'Filter shifts by on_break status',
    example: ShiftStatus.active,
  })
  on_break?: boolean;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean; // Returns original value if it's not a boolean string
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Include origin location details',
    example: ShiftStatus.active,
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
    example: ShiftStatus.active,
  })
  destination?: boolean;

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
