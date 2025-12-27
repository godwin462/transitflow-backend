import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/auth.decorator';
import {
  AccountVerificationDto,
  AccountVerificationEmailDto,
} from './dto/account-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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
    // console.log('Refresh token payload', payload);
    return {
      message: 'Token refreshed successfully',
      success: true,
      data: await this.authService.refreshTokens(payload.refreshToken),
    };
  }

  @Get('/me')
  async me(@Req() req: RequestWithUser) {
    // console.log('Getting current auth user payload', req.user);
    return {
      message: 'User fetched successfully',
      success: true,
      data: await this.userService.findUserById(req.user.id),
    };
  }

  @Post('/logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.id);
  }

  @Public()
  @Post('/verify-account')
  async verifyEmail(@Body() payload: AccountVerificationDto) {
    return this.authService.verifyUser(payload.email, payload.otp);
  }

  @Public()
  @Post('/send-verification-email')
  async resendVerificationEmail(@Body() payload: AccountVerificationEmailDto) {
    // console.log('Resend verification email payload', payload);
    return this.authService.resendVerificationEmail(payload.email);
  }
}
