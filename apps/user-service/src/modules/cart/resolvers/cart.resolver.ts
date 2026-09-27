import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AddToCartInput, CartType, UpdateCartItemInput } from '../models/cart.models';
import { CartService } from '../services/cart.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartType, { nullable: true })
  async getCart(@Context() context: any): Promise<CartType | null> {
    const userId = context.req.user.sub;
    return this.cartService.getCart(userId);
  }

  @Mutation(() => CartType)
  async addToCart(
    @Context() context: any,
    @Args('input') input: AddToCartInput,
  ): Promise<CartType> {
    const userId = context.req.user.sub;
    return this.cartService.addItem(userId, input);
  }

  @Mutation(() => CartType, { nullable: true })
  async updateCartItem(
    @Context() context: any,
    @Args('itemId', { type: () => ID }) itemId: string,
    @Args('input') input: UpdateCartItemInput,
  ): Promise<CartType | null> {
    const userId = context.req.user.sub;
    return this.cartService.updateItemQuantity(userId, itemId, input);
  }

  @Mutation(() => CartType, { nullable: true })
  async removeFromCart(
    @Context() context: any,
    @Args('itemId', { type: () => ID }) itemId: string,
  ): Promise<CartType | null> {
    const userId = context.req.user.sub;
    return this.cartService.removeItem(userId, itemId);
  }

  @Mutation(() => Boolean)
  async clearCart(@Context() context: any): Promise<boolean> {
    const userId = context.req.user.sub;
    return this.cartService.clearCart(userId);
  }
}
