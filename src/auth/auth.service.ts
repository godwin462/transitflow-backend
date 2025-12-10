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
    const existingUserMail = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        roles: true,
      },
    });
    const existingUserName = await this.prisma.user.findUnique({
      where: {
        username: payload.username,
      },
      include: {
        roles: true,
      },
    });
    if (existingUserMail) {
      if (existingUserMail.roles.some((roleItem) => roleItem.role === role)) {
        throw new BadRequestException(
          'User already exists, please login to continue or create a new account',
        );
      }
      await this.prisma.userRole.create({
        data: {
          userId: existingUserMail.id,
          role,
        },
      });
      return { message: 'Account created successfully', success: true };
    }
    if (existingUserName) {
      if (existingUserName.roles.some((roleItem) => roleItem.role === role)) {
        throw new BadRequestException(
          'User already exists, please login to continue or create a new account',
        );
      }
      await this.prisma.userRole.create({
        data: {
          userId: existingUserName.id,
          role,
        },
      });
      return { message: 'Account created successfully', success: true };
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

    return { message: 'Account created successfully', success: true };
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
    const refreshToken = await this.generateRefreshToken(user.id, payload.role);
    const accessToken = this.getAccessToken(user.id, payload.role);

    return {
      success: true,
      user,
      accessToken,
      refreshToken,
    };
  }

  async generateRefreshToken(userId: string, role: string) {
    const refreshToken = this.jwtService.sign(
      {
        userId,
        role,
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

  getAccessToken(userId: string, role: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        role,
      },
      {
        secret: jwtConstants.accessTokenSecret,
        expiresIn: '1m',
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
    let decoded: JwtPayloadInterface;
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
    const newAccessToken = this.getAccessToken(userId, decoded.role);
    const newRefreshToken = await this.generateRefreshToken(
      userId,
      decoded.role,
    );

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
      success: true,
    };
  }
}
