import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, Context, Favorite, Image, Spot } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type SpotWithRelations = Spot & {
  category: Category;
  images: Image[];
  context: Context;
};

type FavoriteWithSpot = Favorite & {
  spot: SpotWithRelations;
};

const favoriteSpotInclude = {
  category: true,
  images: {
    orderBy: {
      order: 'asc' as const,
    },
  },
  context: true,
};

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(userId: number, spotId: number): Promise<FavoriteWithSpot> {
    const spot = await this.prisma.spot.findUnique({
      where: { id: spotId },
      select: { id: true },
    });

    if (!spot) {
      throw new NotFoundException('Spot not found');
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_spotId: {
          userId,
          spotId,
        },
      },
      include: {
        spot: {
          include: favoriteSpotInclude,
        },
      },
    });

    if (existingFavorite) {
      return existingFavorite;
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        spotId,
      },
      include: {
        spot: {
          include: favoriteSpotInclude,
        },
      },
    });
  }

  async removeFavorite(
    userId: number,
    spotId: number,
  ): Promise<{ success: boolean }> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_spotId: {
          userId,
          spotId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        userId_spotId: {
          userId,
          spotId,
        },
      },
    });

    return { success: true };
  }

  async findMyFavorites(userId: number): Promise<FavoriteWithSpot[]> {
    return this.prisma.favorite.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        spot: {
          include: favoriteSpotInclude,
        },
      },
    });
  }
}
