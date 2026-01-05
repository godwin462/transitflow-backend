import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ShiftStatus } from 'generated/prisma/enums';
import { LatLngDto } from './create-shift.dto';

export class UpdateShiftDto {
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Shift end time',
    example: '2022-01-01T00:00:00.000Z',
  })
  endTime?: Date;

  @IsEnum(ShiftStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Shift status',
    example: ShiftStatus.online,
  })
  status?: ShiftStatus;

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
