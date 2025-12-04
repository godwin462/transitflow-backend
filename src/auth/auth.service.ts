import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(payload: CreateUserDto, role: Role, password: string) {
    const user = await this.prisma.user.create({
      data: {
        ...payload,
        role,
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

  async login(payload: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const auth = await this.prisma.auth.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!auth) {
      throw new Error('User not found');
    }
    return {
      user,
      auth,
    };
  }
}
