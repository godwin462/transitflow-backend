import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AccountVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email for account verification',
    example: 'user@example.com',
  })
  email: string;
  @IsNotEmpty()
  @Length(6, 6)
  @ApiProperty({
    description: 'OTP code sent to user email for verification',
    example: '123456',
  })
  otp: string;
}

export class AccountVerificationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email for account verification',
    example: 'user@example.com',
  })
  email: string;
}
