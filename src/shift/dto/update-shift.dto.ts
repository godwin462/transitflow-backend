import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateShiftDto {
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'Shift end time',
    example: '2022-01-01T00:00:00.000Z',
  })
  endTime?: Date;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is the shift active',
    example: true,
  })
  isActive?: boolean;
}
