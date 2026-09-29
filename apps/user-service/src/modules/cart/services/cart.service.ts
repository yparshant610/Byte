import { Inject, Injectable } from '@nestjs/common';
import { RedisCartStore } from '@repo/redis-cache';
import { REDIS_CART_STORE } from '../../redis/redis-provider.module';
import { AddToCartInput, CartType, UpdateCartItemInput } from '../models/cart.models';

@Injectable()
export class CartService {
  constructor(
    @Inject(REDIS_CART_STORE)
    private readonly cartStore: RedisCartStore,
  ) {}

  async getCart(userId: string): Promise<CartType | null> {
    const cart = await this.cartStore.getCart(userId);
    return cart as CartType | null;
  }

  async addItem(userId: string, input: AddToCartInput): Promise<CartType> {
    const updated = await this.cartStore.addItem({
      userId,
      restaurantId: input.restaurantId,
      restaurantName: input.restaurantName,
      itemId: input.itemId,
      name: input.name,
      quantity: input.quantity,
      basePrice: input.basePrice,
      selectedOptions: input.selectedOptions,
      clearExisting: input.clearExisting,
    });
    return updated as CartType;
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    input: UpdateCartItemInput,
  ): Promise<CartType | null> {
    const updated = await this.cartStore.updateItem(
      userId,
      itemId,
      input.quantity,
      input.selectedOptions,
    );
    return updated as CartType | null;
  }

  async removeItem(userId: string, itemId: string): Promise<CartType | null> {
    const updated = await this.cartStore.removeItem(userId, itemId);
    return updated as CartType | null;
  }

  async clearCart(userId: string): Promise<boolean> {
    return this.cartStore.clearCart(userId);
  }
}
