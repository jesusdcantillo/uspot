import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import type { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories: Category[] = await this.prisma.category.findMany();
    return categories.map(
      (category): CategoryResponseDto => ({
        id: category.id,
        name: category.name,
        description: category.description ?? undefined,
      }),
    );
  }
}
