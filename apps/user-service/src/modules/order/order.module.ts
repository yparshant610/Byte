import { Module } from '@nestjs/common';
import { DispatchModule } from '../dispatch/dispatch.module';
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { OrderGateway } from './gateways/order.gateway';
import { OrderService } from './services/order.service';

@Module({
  imports: [DispatchModule],
  controllers: [OrderController, PaymentController],
  providers: [OrderService, OrderGateway],
  exports: [OrderService, OrderGateway],
})
export class OrderModule {}
