import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class PickupDto {
  @IsString()
  @MaxLength(11)
  @MinLength(11)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Trip Ticket',
    example: 'TF-123456AD',
  })
  ticket: string;
}
