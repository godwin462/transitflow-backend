import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'generated/prisma/enums';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() payload: CreateUserDto, @Body() password: string) {
    return this.userService.createUser(payload, Role.PASSENGER, password);
  }
}
