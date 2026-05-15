import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextsController } from './contexts.controller';
import { ContextsService } from './contexts.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContextsController],
  providers: [ContextsService],
})
export class ContextsModule {}
