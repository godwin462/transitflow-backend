import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  async createVehicle(vehicle: CreateVehicleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: vehicle.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.vehicle.create({ data: vehicle });
  }

  async getVehicleById(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async getVehiclesByUserId(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      include: { images: true },
    });
  }

  async updateVehicleById(id: string, vehicle: CreateVehicleDto) {
    return this.prisma.vehicle.update({ where: { id }, data: vehicle });
  }

  async deleteVehicleById(id: string) {
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async getVehicles() {
    return this.prisma.vehicle.findMany({ include: { images: true } });
  }
}
