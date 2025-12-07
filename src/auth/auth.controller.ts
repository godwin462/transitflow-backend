import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './guards/auth.guard';

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

  @Post('/refresh')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshTokens(payload.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.userId);
  }
}
