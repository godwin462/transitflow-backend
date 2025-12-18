import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async createVehicle(
    vehicle: CreateVehicleDto,
    images: Express.Multer.File[],
  ) {
    let imagesData: { secureUrl: string; publicId: string }[] = [];
    try {
      if (!images || images.length === 0) {
        throw new ForbiddenException('No images provided');
      }
      const user = await this.prisma.user.findUnique({
        where: { id: vehicle.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const existingVehicle = await this.prisma.vehicle.findFirst({
        where: {
          userId: vehicle.userId,
        },
      });
      if (existingVehicle) {
        throw new ForbiddenException('User already has a vehicle registered');
      }
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          return this.cloudinary.uploadFile(image, 'vehicle');
        }),
      );
      // console.log(uploadedImages);
      imagesData = uploadedImages.map((image) => {
        return {
          secureUrl: image.secure_url as string,
          publicId: image.public_id as string,
        };
      });
      return this.prisma.vehicle.create({
        data: {
          ...vehicle,
          images: {
            create: imagesData,
          },
        },
        include: { images: true },
      });
    } catch (error) {
      if (imagesData && imagesData.length > 0) {
        await Promise.all(
          imagesData.map(async (image) => {
            await this.cloudinary.deleteFile(image.publicId);
            return;
          }),
        );
      }
      throw error;
    }
  }

  async getVehicleById(id: string) {
    console.log(id);
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

  async getVehicleByUserId(userId: string) {
    return this.prisma.vehicle.findUnique({
      where: { userId },
      include: { images: true },
    });
  }

  async updateVehicleById(
    id: string,
    payload: UpdateVehicleDto,
    images: Express.Multer.File[],
  ) {
    let imagesData: { secureUrl: string; publicId: string }[] = [];
    try {
      // if (!images || images.length === 0) {
      //   throw new ForbiddenException('No images provided');
      // }
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }
      const user = await this.prisma.user.findUnique({
        where: { id: vehicle.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const oldVehicleImages = await this.prisma.vehicleImage.findMany({
        where: { vehicleId: id },
      });
      if (oldVehicleImages.length > 0 && images.length > 0) {
        await Promise.all(
          oldVehicleImages.map(async (image) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return await this.cloudinary.deleteFile(image.publicId);
          }),
        );
        const uploadedImages = await Promise.all(
          images.map(async (image) => {
            return this.cloudinary.uploadFile(image, 'vehicle');
          }),
        );
        // console.log(uploadedImages);
        imagesData = uploadedImages.map((image) => {
          return {
            secureUrl: image.secure_url as string,
            publicId: image.public_id as string,
          };
        });
        await this.prisma.vehicleImage.deleteMany({
          where: { vehicleId: id },
        });
        return this.prisma.vehicle.update({
          where: { id },
          data: {
            ...payload,
            images: {
              create: imagesData,
            },
          },
          include: { images: true },
        });
      } else if (oldVehicleImages.length === 0 && images && images.length > 0) {
        const uploadedImages = await Promise.all(
          images.map(async (image) => {
            return this.cloudinary.uploadFile(image, 'vehicle');
          }),
        );
        // console.log(uploadedImages);
        imagesData = uploadedImages.map((image) => {
          return {
            secureUrl: image.secure_url as string,
            publicId: image.public_id as string,
          };
        });
        return this.prisma.vehicle.update({
          where: { id },
          data: {
            ...payload,
            images: {
              create: imagesData,
            },
          },
          include: { images: true },
        });
      }
      return this.prisma.vehicle.update({
        where: { id },
        data: payload,
        include: { images: true },
      });
    } catch (error) {
      if (imagesData && imagesData.length > 0) {
        await Promise.all(
          imagesData.map(async (image) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.cloudinary.deleteFile(image.publicId);
          }),
        );
      }
      throw error;
    }
  }

  async deleteVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.delete({
      where: { id },
      include: { images: true },
    });
    if (vehicle.images && vehicle.images.length > 0) {
      await Promise.all(
        vehicle.images.map(async (image) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this.cloudinary.deleteFile(image.publicId);
        }),
      );
    }
    return vehicle;
  }

  async getVehicles() {
    return this.prisma.vehicle.findMany({ include: { images: true } });
  }
}
