import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('me')
  findMyFavorites() {
    return this.favoritesService.findMyFavorites();
  }

  @Post(':spotId')
  addFavorite(@Param('spotId', ParseIntPipe) spotId: number) {
    return this.favoritesService.addFavorite(spotId);
  }

  @Delete(':spotId')
  removeFavorite(@Param('spotId', ParseIntPipe) spotId: number) {
    return this.favoritesService.removeFavorite(spotId);
  }
}
