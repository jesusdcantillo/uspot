import { Controller, Get } from '@nestjs/common';
import { Country } from '@prisma/client';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async findAll(): Promise<
    Array<{
      id: number;
      name: string;
      country: Country;
    }>
  > {
    return this.citiesService.findAll();
  }
}
