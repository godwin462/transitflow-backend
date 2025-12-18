import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class LoginUserDto {
  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({
    description: 'User role',
    example: 'driver',
  })
  role: Role;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  password: string;
}
