import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';

@ApiTags('Payments & Split Ledger')
@Controller('payments')
export class PaymentController {
  constructor(private readonly orderService: OrderService) {}

  @Post('razorpay-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook receiver for Razorpay split payment captures',
    description:
      'Receives and validates HMAC-SHA256 signature for Razorpay webhooks (payment.captured, payment.failed, refund.processed) and triggers automated status advancement and split accounting.',
  })
  @ApiHeader({
    name: 'x-razorpay-signature',
    description: 'HMAC-SHA256 signature for payload verification',
    required: false,
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean' },
        status: { type: 'string' },
      },
    },
  })
  async handleWebhook(
    @Req() req: any,
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature?: string,
  ) {
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(payload);
    return this.orderService.handleRazorpayWebhook(payload, signature, rawBody);
  }
}
