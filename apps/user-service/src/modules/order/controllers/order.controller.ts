import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';

@ApiTags('Orders & Payments')
@Controller('payments')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('razorpay-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook receiver for Razorpay split payment captures',
    description: 'Calculates the 80/20 split between vendor/driver and Byte Add platform commission.',
  })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { received: { type: 'boolean' } } } })
  async handleWebhook(@Body() payload: any) {
    return this.orderService.handleRazorpayWebhook(payload);
  }
}
