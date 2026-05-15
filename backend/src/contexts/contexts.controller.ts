import { Controller, Get } from '@nestjs/common';
import { ContextResponseDto } from './dto/context-response.dto';
import { ContextsService } from './contexts.service';

@Controller('contexts')
export class ContextsController {
  constructor(private readonly contextsService: ContextsService) {}

  @Get()
  findAll(): Promise<ContextResponseDto[]> {
    return this.contextsService.findAll();
  }
}
