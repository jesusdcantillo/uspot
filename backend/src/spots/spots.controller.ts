import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Body() createSpotDto: CreateSpotDto): Promise<SpotResponseDto> {
    return this.spotsService.create(createSpotDto);
  }

  @Get()
  findAll(): Promise<SpotResponseDto[]> {
    return this.spotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SpotResponseDto> {
    return this.spotsService.findOne(id);
  }
}
