import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ContextResponseDto } from './dto/context-response.dto';
import { ContextsService } from './contexts.service';

@Controller('contexts')
export class ContextsController {
  constructor(private readonly contextsService: ContextsService) {}

  @Get()
  findAll(
    @Query('cityId', new ParseIntPipe({ optional: true })) cityId?: number,
  ): Promise<ContextResponseDto[]> {
    return this.contextsService.findAll(cityId);
  }
}
