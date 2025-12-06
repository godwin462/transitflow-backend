import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: CreateUserDto, role: Role, password: string) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);
    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        role,
      },
    });
    await this.prisma.auth.create({
      data: {
        userId: user.id,
        password: passwordHash,
      },
    });

    return user;
  }

  async login(payload: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        auth: true,
      },
    });
    // check if user exists
    if (!user || !user.auth) {
      throw new NotFoundException('User not found');
    }
    // create auth tokens for the user
    const accessToken = this.jwtService.sign({
      userId: user.id,
    });
    const refreshToken = this.jwtService.sign({
      userId: user.id,
    });
    await this.prisma.authToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
      },
    });
    return {
      user,
      auth: user.auth,
      accessToken,
      refreshToken,
    };
  }
}
