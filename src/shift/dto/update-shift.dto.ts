import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { ShiftStatus } from 'generated/prisma/enums';

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
    example: ShiftStatus.completed,
  })
  status?: ShiftStatus;
}
