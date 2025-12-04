import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createPassenger(payload: CreateUserDto, password: string) {
    return this.authService.createUser(payload, Role.PASSENGER, password);
  }

  async createDriver(payload: CreateUserDto, password: string) {
    return this.authService.createUser(payload, Role.DRIVER, password);
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateUser(id: string, payload: CreateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: payload,
    });
  }
}
