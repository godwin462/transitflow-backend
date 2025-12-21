import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import otpGenerator from 'otp-generator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  generateOtp() {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    return otp;
  }

  async createOtp(userId: string) {
    const otp = this.generateOtp();
    const hashedOtp = bcrypt.hashSync(otp, 10);
    const createdOtp = await this.prisma.otp.upsert({
      where: {
        userId,
      },
      update: {
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
      create: {
        userId,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    return { otp, createdOtp };
  }

  async verifyOtp(userId: string, otp: string) {
    const userOtp = await this.prisma.otp.findUnique({
      where: {
        userId,
      },
    });
    if (!userOtp) {
      throw new HttpException('Invalid otp', 400);
    }
    if (userOtp.expiresAt < new Date()) {
      // await this.deleteOtp(userId);
      throw new HttpException('Otp expired', 400);
    }
    const isMatch = await bcrypt.compare(otp, userOtp.otp);
    if (!isMatch) {
      throw new HttpException('Invalid otp', 400);
    }
    await this.deleteOtp(userId);
    return true;
  }

  async deleteOtp(userId: string) {
    return await this.prisma.otp.delete({
      where: {
        userId,
      },
    });
  }

  async updateOtp(userId: string) {
    const userOtp = await this.prisma.otp.findUnique({
      where: {
        userId,
      },
    });
    console.log('User OTP', userId, userOtp);
    if (!userOtp) {
      return await this.createOtp(userId);
    }
    if (userOtp.retryAfter && userOtp.retryAfter < new Date()) {
      throw new HttpException(
        `You can try again after ${userOtp.retryAfter.toLocaleString()}`,
        400,
      );
    }
    if (userOtp.attempts >= 3) {
      const otp = this.generateOtp();
      const hashedOtp = bcrypt.hashSync(otp, 10);
      const retryAfter = new Date(Date.now() + 60 * 15 * 1000); // 15 minutes
      await this.prisma.otp.upsert({
        where: {
          userId,
        },
        update: {
          retryAfter,
          attempts: 0,
        },
        create: {
          userId,
          otp: hashedOtp,
          expiresAt: userOtp.expiresAt,
          retryAfter,
          attempts: 0,
        },
      });
      throw new HttpException(
        `Too many attempts, try again after ${retryAfter.toLocaleString()}`,
        400,
      );
    }
    const otp = this.generateOtp();
    const hashedOtp = bcrypt.hashSync(otp, 10);
    return {
      otp,
      updatedOtp: await this.prisma.otp.update({
        where: {
          userId,
        },
        data: {
          otp: hashedOtp,
          attempts: {
            increment: 1,
          },
        },
      }),
    };
  }
}
