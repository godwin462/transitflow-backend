import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    payload: Omit<User, 'id' | 'role' | 'auth'>,
    role: Role,
    password: string,
  ) {
    const user = await this.prisma.user.create({
      data: {
        ...payload,
        role,
        // password,
      },
    });
    await this.prisma.auth.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        password,
        token: '',
      },
    });

    return user;
  }

  async createPassenger(payload: User, password: string) {
    return this.createUser(payload, Role.PASSENGER, password);
  }

  async createDriver(payload: User, password: string) {
    return this.createUser(payload, Role.DRIVER, password);
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

  async updateUser(id: string, payload: User) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: payload,
    });
  }
}
