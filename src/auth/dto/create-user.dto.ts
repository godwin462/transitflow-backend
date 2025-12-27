import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'User username',
    example: 'username',
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    example: 'password@123',
  })
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({
    description: 'User role',
    example: Role.driver,
  })
  role: Role;
}
