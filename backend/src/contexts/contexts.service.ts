import { Injectable } from '@nestjs/common';
import { Context } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ContextResponseDto } from './dto/context-response.dto';

@Injectable()
export class ContextsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(cityId?: number): Promise<ContextResponseDto[]> {
    const contexts: Context[] = await this.prisma.context.findMany({
      where: cityId ? { cityId } : undefined,
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    return contexts.map(
      (context): ContextResponseDto => ({
        id: context.id,
        name: context.name,
        type: context.type,
        latitude: context.latitude,
        longitude: context.longitude,
        zoom: context.zoom,
        createdAt: context.createdAt,
        updatedAt: context.updatedAt,
      }),
    );
  }
}
