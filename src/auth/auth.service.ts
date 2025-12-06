import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login.dto';
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
      throw new NotFoundException(
        'User not found, check your credentials or create an account',
      );
    }
    const auth = await this.prisma.auth.findUnique({
      where: {
        userId: user.id,
      },
    });
    // check if user exists
    if (!auth) {
      throw new NotFoundException(
        'User not found, check your credentials or create an account',
      );
    }
    // console.log(payload);
    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      auth.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(
        'Invalid credentials, check your credentials or create an account',
      );
    }

    // create auth tokens for the user
    const accessToken = await this.getAccessToken(user.id);
    const refreshToken = await this.getRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async getAccessToken(userId: string) {
    const token = await this.prisma.authToken.findUnique({
      where: {
        userId,
      },
    });
    if (token) {
      const isTokenValid = this.jwtService.verify(token.token, {
        secret: jwtConstants.accessTokenSecret,
      });
      if (isTokenValid) {
        return token.token;
      }
      await this.prisma.authToken.deleteMany({
        where: {
          userId,
        },
      });
    }
    const accessToken = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: jwtConstants.accessTokenSecret,
      },
    );
    await this.prisma.authToken.create({
      data: {
        userId,
        token: accessToken,
      },
    });
    return accessToken;
  }

  async getRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: jwtConstants.accessTokenSecret,
        expiresIn: '1d',
      },
    );
    return refreshToken;
  }
}
