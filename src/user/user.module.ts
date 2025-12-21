import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { OtpService } from 'src/otp/otp.service';

@Module({
  providers: [
    UserService,
    PrismaService,
    AuthService,
    JwtService,
    EmailService,
    OtpService,
  ],
  controllers: [UserController],
  exports: [PrismaService, AuthService],
})
export class UserModule {}
