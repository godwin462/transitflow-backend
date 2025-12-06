import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createPassenger(payload: CreateUserDto) {
    return this.authService.createUser(
      payload,
      Role.PASSENGER,
      payload.password,
    );
  }

  async createDriver(payload: CreateUserDto) {
    return this.authService.createUser(payload, Role.DRIVER, payload.password);
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

  async updateUser(id: string, payload: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: payload,
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }
}
