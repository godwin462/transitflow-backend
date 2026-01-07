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
import { CreateRouteDto } from './create-shift.dto';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRouteDto)
  @ApiProperty()
  route?: CreateRouteDto;
}
