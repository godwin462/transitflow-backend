import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'generated/prisma/enums';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('driver')
  async createDriver(@Body() payload: CreateUserDto, @Body() password: string) {
    return this.userService.createDriver(payload, password);
  }

  @Post('passenger')
  async createPassenger(
    @Body() payload: CreateUserDto,
    @Body() password: string,
  ) {
    return this.userService.createPassenger(payload, password);
  }
}
