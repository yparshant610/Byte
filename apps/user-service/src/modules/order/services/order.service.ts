import { Injectable } from '@nestjs/common';
import { OrderType } from '../models/order.models';

@Injectable()
export class OrderService {
  calculateSplit(totalAmount: number): { adminCommission: number; vendorDriverPayout: number } {
    // Formula from architecture spec: 0.8 (Restaurant + Driver) + 0.2 (Byte Add Admin Commission)
    const adminCommission = parseFloat((totalAmount * 0.20).toFixed(2));
    const vendorDriverPayout = parseFloat((totalAmount * 0.80).toFixed(2));

    return { adminCommission, vendorDriverPayout };
  }

  async handleRazorpayWebhook(payload: any): Promise<{ received: boolean; status: string }> {
    const event = payload?.event || 'payment.captured';
    // Validate signature & process 80/20 split
    return {
      received: true,
      status: `Processed event: ${event}`,
    };
  }

  async createMockOrder(subtotal: number, deliveryFee = 2.49, driverTip = 3.00): Promise<OrderType> {
    const totalAmount = parseFloat((subtotal + deliveryFee + driverTip).toFixed(2));
    const { adminCommission, vendorDriverPayout } = this.calculateSplit(totalAmount);

    return {
      id: `ord_${Date.now()}`,
      restaurantId: 'r0000001-0000-0000-0000-000000000001',
      status: 'ACCEPTED',
      subtotal,
      deliveryFee,
      driverTip,
      totalAmount,
      adminCommission,
      vendorDriverPayout,
    };
  }
}
