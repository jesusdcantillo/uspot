import {
  Body,
  Controller,
  Get,
  BadRequestException,
  Query,
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
  findAll(@Query('contextId') contextId?: string): Promise<SpotResponseDto[]> {
    if (contextId !== undefined) {
      const parsedContextId = Number(contextId);

      if (Number.isNaN(parsedContextId)) {
        throw new BadRequestException('contextId must be a valid number');
      }

      return this.spotsService.findAll(parsedContextId);
    }

    return this.spotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SpotResponseDto> {
    return this.spotsService.findOne(id);
  }
}
