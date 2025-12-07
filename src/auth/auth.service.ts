import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async createUser(payload: CreateUserDto, role: Role, password: string) {
    let existingUser = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        roles: true,
      },
    });
    if (existingUser) {
      if (existingUser.roles.some((roleItem) => roleItem.role === role)) {
        throw new BadRequestException(
          'User already exists, please login to continue',
        );
      }
      await this.prisma.userRole.create({
        data: {
          userId: existingUser.id,
          role,
        },
      });
      return await this.userService.findUserById(existingUser.id);
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    // console.log(passwordHash);
    const newUser = await this.prisma.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        roles: {
          create: [{ role }],
        },
      },
    });

    await this.prisma.auth.create({
      data: {
        userId: newUser.id,
        password: passwordHash,
      },
    });

    return await this.userService.findUserById(newUser.id);
  }

  async login(payload: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        roles: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const auth = await this.prisma.auth.findUnique({
      where: {
        userId: user.id,
      },
    });
    // check if user exists
    if (!auth) {
      throw new NotFoundException('Invalid credentials');
    }
    // console.log(payload);
    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      auth.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // create auth tokens for the user
    const refreshToken = await this.generateRefreshToken(user.id);
    const accessToken = await this.getAccessToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async generateRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: jwtConstants.refreshTokenSecret,
        expiresIn: '7d',
      },
    );
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

    await this.prisma.authToken.upsert({
      where: {
        userId,
      },
      update: {
        token: refreshTokenHash,
      },
      create: {
        userId,
        token: refreshTokenHash,
      },
    });

    return refreshToken;
  }

  async getAccessToken(userId: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: jwtConstants.accessTokenSecret,
        expiresIn: '15m',
      },
    );
    return accessToken;
  }

  async validateRefreshToken(userId: string, providedToken: string) {
    const stored = await this.prisma.authToken.findUnique({
      where: { userId },
    });

    if (!stored) throw new BadRequestException('No refresh token stored');

    const match = await bcrypt.compare(providedToken, stored.token);
    if (!match) throw new BadRequestException('Refresh token invalid');
  }

  async refreshTokens(refreshToken: string) {
    // 1. Decode token to get userId
    let decoded: any;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshTokenSecret,
      });
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }

    const userId = decoded.userId;

    // 2. Get saved hash from DB
    const tokenRecord = await this.prisma.authToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Refresh token not found');
    }

    await this.validateRefreshToken(userId, refreshToken);

    // 4. Generate new tokens
    const newAccessToken = await this.getAccessToken(userId);
    const newRefreshToken = await this.generateRefreshToken(userId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.authToken.deleteMany({
      where: { userId },
    });
    return {
      message: 'Logged out successfully',
    };
  }
}
