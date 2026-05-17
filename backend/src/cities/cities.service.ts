import { Injectable } from '@nestjs/common';
import { City } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<
    Array<{
      id: number;
      name: string;
      country: City['country'];
    }>
  > {
    const cities: City[] = await this.prisma.city.findMany({
      orderBy: [{ name: 'asc' }],
    });

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country,
    }));
  }
}
