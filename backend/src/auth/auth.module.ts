import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [PrismaModule],
  providers: [SupabaseService, SupabaseAuthGuard],
  exports: [SupabaseService, SupabaseAuthGuard],
})
export class AuthModule {}
