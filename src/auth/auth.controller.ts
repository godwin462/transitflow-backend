import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register/passenger')
  async registerPassenger(@Body() payload: CreateUserDto) {
    return this.userService.createPassenger(payload);
  }

  @Post('/register/driver')
  async registerDriver(@Body() payload: CreateUserDto) {
    return this.userService.createDriver(payload);
  }

  @Post('/login')
  async login(@Body() payload: LoginUserDto) {
    return this.authService.login(payload);
  }
}
