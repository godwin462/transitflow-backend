import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserService } from './user/user.service';
import { VehicleService } from './vehicle/vehicle.service';
import { VehicleController } from './vehicle/vehicle.controller';
import { VehicleModule } from './vehicle/vehicle.module';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [CacheModule.register(), UserModule, AuthModule, VehicleModule],
  controllers: [AppController, VehicleController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    JwtService,
    UserService,
    VehicleService,
  ],
})
export class AppModule {}
