import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { SpotsModule } from './spots/spots.module';
import { ContextsModule } from './contexts/contexts.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    SpotsModule,
    ContextsModule,
    FavoritesModule,
    CitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
