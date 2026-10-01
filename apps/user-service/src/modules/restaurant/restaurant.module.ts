import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantResolver } from './resolvers/restaurant.resolver';
import { RestaurantService } from './services/restaurant.service';
import { S3StorageService } from './services/s3-storage.service';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantResolver, S3StorageService],
  exports: [RestaurantService, S3StorageService],
})
export class RestaurantModule {}
