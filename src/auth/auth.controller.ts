import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Public()
  @Post('/register/passenger')
  async registerPassenger(@Body() payload: CreateUserDto) {
    return this.userService.createPassenger(payload);
  }

  @Public()
  @Post('/register/driver')
  async registerDriver(@Body() payload: CreateUserDto) {
    return this.userService.createDriver(payload);
  }

  @Public()
  @Post('/login')
  async login(@Body() payload: LoginUserDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    // console.log(payload);
    return {
      message: 'Token refreshed successfully',
      success: true,
      data: await this.authService.refreshTokens(payload.refreshToken),
    };
  }

  @Get('/me')
  async me(@Req() req: RequestWithUser) {
    return {
      message: 'User fetched successfully',
      success: true,
      data: await this.userService.findUserById(req.user.userId),
    };
  }

  @Post('/logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.userId);
  }
}
