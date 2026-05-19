import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { type AuthenticatedUser } from '../auth/types';
import { CreateSpotDto } from './dto/create-spot.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(
    @Body() createSpotDto: CreateSpotDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SpotResponseDto> {
    return this.spotsService.create(user.id, createSpotDto);
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
