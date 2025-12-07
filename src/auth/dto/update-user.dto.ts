import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User username',
    example: 'JohnDoe',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName?: string;

  // @IsOptional()
  // @IsString()
  // @ApiProperty({
  //   description: 'User phone number',
  //   example: '123456789',
  // })
  // phoneNumber?: string;
}
