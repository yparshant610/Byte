import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { AddToCartInput, CartType, UpdateCartItemInput } from '../models/cart.models';
import { CartService } from '../services/cart.service';

@ApiTags('Shopping Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch active consumer shopping cart from Redis' })
  @ApiResponse({ status: 200, type: CartType })
  async getCart(@Req() req: any): Promise<CartType | null> {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('items')
  @ApiOperation({
    summary: 'Add item with options to Redis cart',
    description: 'Enforces single-restaurant integrity. Throws 409 Conflict if items from another restaurant are already present, unless `clearExisting: true`.',
  })
  @ApiResponse({ status: 200, type: CartType })
  async addItem(@Req() req: any, @Body() body: AddToCartInput): Promise<CartType> {
    return this.cartService.addItem(req.user.sub, body);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update quantity of an item in cart' })
  @ApiResponse({ status: 200, type: CartType })
  async updateQuantity(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemInput,
  ): Promise<CartType | null> {
    return this.cartService.updateItemQuantity(req.user.sub, itemId, body);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove a specific item from cart' })
  @ApiResponse({ status: 200, type: CartType })
  async removeItem(@Req() req: any, @Param('itemId') itemId: string): Promise<CartType | null> {
    return this.cartService.removeItem(req.user.sub, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the entire shopping cart' })
  @ApiResponse({ status: 200, schema: { type: 'boolean' } })
  async clearCart(@Req() req: any): Promise<boolean> {
    return this.cartService.clearCart(req.user.sub);
  }
}
