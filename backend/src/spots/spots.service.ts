import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, Image, Spot } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { SpotResponseDto } from './dto/spot-response.dto';

type SpotWithRelations = Spot & {
  category: Category;
  images: Image[];
};

@Injectable()
export class SpotsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpotDto: CreateSpotDto): Promise<SpotResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: createSpotDto.userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: createSpotDto.categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const spot = await this.prisma.spot.create({
      data: {
        userId: createSpotDto.userId,
        categoryId: createSpotDto.categoryId,
        title: createSpotDto.title,
        description: createSpotDto.description,
        latitude: createSpotDto.latitude,
        longitude: createSpotDto.longitude,
        address: createSpotDto.address,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return this.mapSpot(spot);
  }

  async findAll(): Promise<SpotResponseDto[]> {
    const spots = await this.prisma.spot.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return spots.map((spot) => this.mapSpot(spot));
  }

  async findOne(id: number): Promise<SpotResponseDto> {
    const spot = await this.prisma.spot.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!spot) {
      throw new NotFoundException('Spot not found');
    }

    return this.mapSpot(spot);
  }

  private mapSpot(spot: SpotWithRelations): SpotResponseDto {
    return {
      id: spot.id,
      title: spot.title,
      description: spot.description,
      latitude: spot.latitude,
      longitude: spot.longitude,
      address: spot.address ?? undefined,
      userId: spot.userId,
      category: {
        id: spot.category.id,
        name: spot.category.name,
        description: spot.category.description ?? undefined,
      },
      images: spot.images.map((image) => ({
        id: image.id,
        url: image.url,
        order: image.order ?? undefined,
      })),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    };
  }
}
