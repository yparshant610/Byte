import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartResolver } from './resolvers/cart.resolver';
import { CartService } from './services/cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
