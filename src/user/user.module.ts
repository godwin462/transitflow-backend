import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService, PrismaService, AuthService],
  controllers: [UserController],
  exports: [PrismaService, AuthService],
})
export class UserModule {}
