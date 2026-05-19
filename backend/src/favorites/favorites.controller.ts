import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { type AuthenticatedUser } from '../auth/types';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(SupabaseAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('me')
  findMyFavorites(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findMyFavorites(user.id);
  }

  @Post(':spotId')
  addFavorite(
    @Param('spotId', ParseIntPipe) spotId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.favoritesService.addFavorite(user.id, spotId);
  }

  @Delete(':spotId')
  removeFavorite(
    @Param('spotId', ParseIntPipe) spotId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.favoritesService.removeFavorite(user.id, spotId);
  }
}
