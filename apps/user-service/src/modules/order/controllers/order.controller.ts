import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  AddTipInput,
  CheckoutInput,
  OrderType,
  RefundOrderInput,
  SubmitReviewInput,
  UpdateOrderStatusInput,
} from '../models/order.models';
import { OrderService } from '../services/order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Checkout active Redis shopping cart',
    description:
      'Creates order, calculates 80/20 multi-split payouts (80% Vendor+Driver, 20% Byte Add platform commission), triggers automated driver dispatch, and prepares Razorpay order.',
  })
  @ApiResponse({ status: 201, type: OrderType })
  async checkout(@Req() req: any, @Body() body: CheckoutInput) {
    const userId = req.user?.sub || 'u0000001-0000-0000-0000-000000000001';
    return this.orderService.checkout(userId, body);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Fetch order details by ID' })
  @ApiResponse({ status: 200, type: OrderType })
  async getOrderById(@Param('orderId') orderId: string): Promise<OrderType> {
    return this.orderService.getOrderById(orderId);
  }

  @Patch(':orderId/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Advance or transition order status with role-based state machine guards',
    description:
      'Guards valid state transitions according to actor role: CONSUMER, MERCHANT / RESTAURANT_OWNER, DRIVER, or ADMIN.',
  })
  @ApiResponse({ status: 200, type: OrderType })
  async updateOrderStatus(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderStatusInput,
  ): Promise<OrderType> {
    const actorRole = req.user?.role || 'CONSUMER';
    return this.orderService.updateOrderStatus(orderId, body, actorRole);
  }

  @Post(':orderId/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process refund and reconcile dispute for an order',
    description: 'Guarded by platform ADMIN authorization. Transitions order to CANCELLED and marks refund ledger.',
  })
  @ApiResponse({ status: 200 })
  async refundOrder(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() body: RefundOrderInput,
  ) {
    const actorRole = req.user?.role || 'ADMIN';
    return this.orderService.refundOrder(orderId, body, actorRole);
  }

  @Post(':orderId/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit dual star ratings and feedback for food and driver',
    description: 'Requires order to be in DELIVERED state. Submits food rating (1-5) and driver delivery rating (1-5).',
  })
  @ApiResponse({ status: 201 })
  async submitReview(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() body: SubmitReviewInput,
  ) {
    const userId = req.user?.sub || 'u0000001-0000-0000-0000-000000000001';
    return this.orderService.submitReview(orderId, userId, body);
  }

  @Post(':orderId/tip')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add or top-up driver tip for an order',
    description: '100% of driver tip amount is disbursed directly to the assigned driver payout ledger.',
  })
  @ApiResponse({ status: 200, type: OrderType })
  async addTip(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Body() body: AddTipInput,
  ): Promise<OrderType> {
    const userId = req.user?.sub || 'u0000001-0000-0000-0000-000000000001';
    return this.orderService.addTip(orderId, userId, body);
  }
}
