import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantResolver } from './resolvers/restaurant.resolver';
import { RestaurantService } from './services/restaurant.service';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantResolver],
  exports: [RestaurantService],
})
export class RestaurantModule {}
