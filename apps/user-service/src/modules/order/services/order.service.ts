import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisCartStore } from '@repo/redis-cache';
import { REDIS_CART_STORE } from '../../redis/redis-provider.module';
import { DispatchService } from '../../dispatch/services/dispatch.service';
import { OrderGateway } from '../gateways/order.gateway';
import {
  AddTipInput,
  CheckoutInput,
  OrderStatus,
  OrderType,
  RefundOrderInput,
  SubmitReviewInput,
  UpdateOrderStatusInput,
} from '../models/order.models';

@Injectable()
export class OrderService implements OnModuleInit {
  // In-memory store for orders and reviews (fallback & fast hydration)
  private readonly orders = new Map<string, OrderType>();
  private readonly reviews = new Map<string, any>();
  private readonly paymentTransactions = new Map<string, any>();

  constructor(
    @Inject(REDIS_CART_STORE)
    private readonly cartStore: RedisCartStore,
    private readonly dispatchService: DispatchService,
    private readonly orderGateway: OrderGateway,
  ) {}

  onModuleInit() {
    // Seed initial test order
    const initialOrder: OrderType = {
      id: 'ord_sample_101',
      userId: '10000000-0000-0000-0000-000000000001',
      restaurantId: '30000000-0000-0000-0000-000000000001',
      restaurantName: "Tony's Artisan Pizza",
      driverId: '80000000-0000-0000-0000-000000000001',
      status: OrderStatus.ACCEPTED,
      items: [
        {
          itemId: '50000000-0000-0000-0000-000000000001',
          name: 'Margherita Classica',
          quantity: 2,
          unitPrice: 16.49,
          totalPrice: 32.98,
          options: [{ groupName: 'Size', choiceName: '12 inch Medium', additionalPrice: 3.50 }],
        },
      ],
      subtotal: 32.98,
      taxAmount: 1.65,
      deliveryFee: 2.49,
      driverTip: 3.00,
      totalAmount: 40.12,
      split: {
        platformCommission: 7.09, // 20% of subtotal + deliveryFee
        restaurantPayout: 26.38, // 80% of subtotal
        driverPayout: 4.99,      // 80% of delivery fee + 100% tip (1.99 + 3.00)
        vendorDriverTotalPayout: 31.37,
      },
      deliveryAddress: 'Penthouse 4B, MG Road Boulevard, Bangalore',
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 3600000,
    };
    this.orders.set(initialOrder.id, initialOrder);
  }

  // ==========================================
  // 1. ORDER SPLIT CALCULATION (80/20 SPLIT)
  // ==========================================
  calculateSplit(subtotal: number, deliveryFee = 2.49, driverTip = 0) {
    // 20% Byte Add Platform Commission on food + delivery
    const platformCommission = parseFloat(((subtotal + deliveryFee) * 0.20).toFixed(2));
    // 80% restaurant food payout
    const restaurantPayout = parseFloat((subtotal * 0.80).toFixed(2));
    // 80% delivery fee to driver + 100% of driver tip
    const driverPayout = parseFloat(((deliveryFee * 0.80) + driverTip).toFixed(2));
    // Total vendor + driver payout
    const vendorDriverTotalPayout = parseFloat((restaurantPayout + driverPayout).toFixed(2));

    return {
      platformCommission,
      restaurantPayout,
      driverPayout,
      vendorDriverTotalPayout,
    };
  }

  // ==========================================
  // 2. CHECKOUT & ORDER CREATION
  // ==========================================
  async checkout(userId: string, input: CheckoutInput): Promise<{ order: OrderType; razorpayOrderId: string; keyId: string }> {
    const cart = await this.cartStore.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Shopping cart is empty. Please add items before checkout.');
    }

    const subtotal = cart.subtotal;
    const taxAmount = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
    const deliveryFee = 2.49;
    const driverTip = input.driverTip || 0;
    const totalAmount = parseFloat((subtotal + taxAmount + deliveryFee + driverTip).toFixed(2));

    const split = this.calculateSplit(subtotal, deliveryFee, driverTip);
    const orderId = `ord_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.items.map(it => ({
      itemId: it.itemId,
      name: it.name,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalPrice: it.itemTotal,
      options: it.selectedOptions?.map(opt => ({
        groupName: opt.groupName,
        choiceName: opt.choiceName,
        additionalPrice: opt.additionalPrice,
      })),
    }));

    // Auto-attempt driver dispatch assignment
    let driverId: string | undefined;
    try {
      const assignment = await this.dispatchService.assignDriver(orderId, {
        restaurantId: cart.restaurantId,
        restaurantLat: input.destinationLat,
        restaurantLng: input.destinationLng,
        radiusKm: 5,
      });
      driverId = assignment.assignedDriverId;
    } catch {
      // Driver assignment can be assigned later when order is accepted
    }

    const order: OrderType = {
      id: orderId,
      userId,
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      driverId,
      status: OrderStatus.PENDING,
      items: orderItems,
      subtotal,
      taxAmount,
      deliveryFee,
      driverTip,
      totalAmount,
      split,
      deliveryAddress: input.deliveryAddress,
      deliveryNotes: input.deliveryNotes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save in local in-memory store
    this.orders.set(orderId, order);

    // Sync to Supabase if configured
    this.syncOrderToSupabase(order).catch(err => console.warn('Supabase order sync error:', err));

    // Clear active Redis cart after successful checkout creation
    await this.cartStore.clearCart(userId);

    const razorpayOrderId = `order_rzp_${Date.now()}`;
    return {
      order,
      razorpayOrderId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_key_id',
    };
  }

  // ==========================================
  // 3. ORDER STATE MACHINE & ROLE-BASED TRANSITIONS
  // ==========================================
  async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput, actorRole = 'CONSUMER'): Promise<OrderType> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    const current = order.status;
    const next = input.status;

    // Validate state machine transitions strictly guarded by actor role
    this.validateStateTransition(current, next, actorRole);

    const previousStatus = order.status;
    order.status = next;
    order.updatedAt = Date.now();
    this.orders.set(orderId, order);

    // Sync status change to Supabase
    this.syncOrderStatusToSupabase(orderId, next).catch(err => console.warn('Supabase status sync error:', err));

    // Real-time broadcast via WebSocket
    this.orderGateway.broadcastOrderStatusUpdated(orderId, {
      previousStatus,
      newStatus: next,
      updatedBy: actorRole,
      timestamp: Date.now(),
    });

    return order;
  }

  validateStateTransition(current: OrderStatus, next: OrderStatus, role: string): void {
    if (current === next) return;

    if (current === OrderStatus.DELIVERED || current === OrderStatus.CANCELLED) {
      throw new ConflictException(`Order is already in terminal state ${current} and cannot be modified.`);
    }

    // Role-specific transition rules
    switch (role) {
      case 'CONSUMER':
        if (next === OrderStatus.CANCELLED) {
          if (current !== OrderStatus.PENDING && current !== OrderStatus.ACCEPTED) {
            throw new BadRequestException('Orders can only be cancelled before food preparation starts.');
          }
          return;
        }
        throw new ForbiddenException('Consumers can only cancel pending or accepted orders.');

      case 'RESTAURANT_OWNER':
      case 'MERCHANT':
        if (current === OrderStatus.PENDING && next === OrderStatus.ACCEPTED) return;
        if (current === OrderStatus.ACCEPTED && next === OrderStatus.PREPARING) return;
        if (current === OrderStatus.PREPARING && next === OrderStatus.READY_FOR_PICKUP) return;
        if (next === OrderStatus.CANCELLED && current !== OrderStatus.OUT_FOR_DELIVERY) return;
        throw new BadRequestException(`Merchants cannot transition order from ${current} to ${next}.`);

      case 'DRIVER':
        if (current === OrderStatus.READY_FOR_PICKUP && next === OrderStatus.OUT_FOR_DELIVERY) return;
        if (current === OrderStatus.OUT_FOR_DELIVERY && next === OrderStatus.DELIVERED) return;
        throw new BadRequestException(`Drivers can only advance orders to OUT_FOR_DELIVERY or DELIVERED.`);

      case 'ADMIN':
        // Admins have full override authority
        return;

      default:
        // Default allow valid natural progression
        const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
          [OrderStatus.PENDING]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
          [OrderStatus.ACCEPTED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
          [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
          [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
          [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
          [OrderStatus.DELIVERED]: [],
          [OrderStatus.CANCELLED]: [],
        };
        if (!allowedTransitions[current].includes(next)) {
          throw new BadRequestException(`Invalid state transition from ${current} to ${next}.`);
        }
    }
  }

  async getOrderById(orderId: string): Promise<OrderType> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }
    return order;
  }

  // ==========================================
  // 4. RAZORPAY WEBHOOKS & SIGNATURE VERIFICATION
  // ==========================================
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_test';
    try {
      const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  async handleRazorpayWebhook(payload: any, signature?: string, rawBody?: string): Promise<{ received: boolean; status: string }> {
    if (signature && rawBody) {
      const isValid = this.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        throw new ForbiddenException('Invalid Razorpay webhook signature verification failed.');
      }
    }

    const event = payload?.event || 'payment.captured';
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderId = paymentEntity?.notes?.orderId;

    if (event === 'payment.captured') {
      if (orderId && this.orders.has(orderId)) {
        await this.updateOrderStatus(orderId, { status: OrderStatus.ACCEPTED }, 'ADMIN');
      }
      this.paymentTransactions.set(paymentEntity?.id || `pay_${Date.now()}`, {
        orderId,
        amount: paymentEntity?.amount ? paymentEntity.amount / 100 : 0,
        status: 'CAPTURED',
        timestamp: Date.now(),
      });
      return { received: true, status: 'PAYMENT_CAPTURED_AND_ORDER_ACCEPTED' };
    }

    if (event === 'payment.failed') {
      if (orderId && this.orders.has(orderId)) {
        await this.updateOrderStatus(orderId, { status: OrderStatus.CANCELLED, reason: 'Payment authorization failed' }, 'ADMIN');
      }
      return { received: true, status: 'PAYMENT_FAILED_AND_ORDER_CANCELLED' };
    }

    if (event === 'refund.processed') {
      return { received: true, status: 'REFUND_PROCESSED' };
    }

    return { received: true, status: `PROCESSED_EVENT_${event}` };
  }

  // ==========================================
  // 5. REFUND & DISPUTE RECONCILIATION
  // ==========================================
  async refundOrder(orderId: string, input: RefundOrderInput, actorRole = 'ADMIN'): Promise<{ success: boolean; refundedAmount: number; status: string }> {
    const order = await this.getOrderById(orderId);
    if (actorRole !== 'ADMIN') {
      throw new ForbiddenException('Only platform administrators can authorize refunds.');
    }

    const refundAmount = input.amount || order.totalAmount;
    if (refundAmount > order.totalAmount) {
      throw new BadRequestException('Refund amount cannot exceed total order amount.');
    }

    // Advance order to CANCELLED
    await this.updateOrderStatus(orderId, { status: OrderStatus.CANCELLED, reason: `Refund: ${input.reason}` }, 'ADMIN');

    this.paymentTransactions.set(`ref_${Date.now()}`, {
      orderId,
      refundAmount,
      reason: input.reason,
      status: 'REFUNDED',
      timestamp: Date.now(),
    });

    return {
      success: true,
      refundedAmount: refundAmount,
      status: 'REFUNDED_AND_RECONCILED',
    };
  }

  // ==========================================
  // 6. FEEDBACK, DUAL STAR RATINGS & TIPPING
  // ==========================================
  async submitReview(orderId: string, userId: string, input: SubmitReviewInput): Promise<{ success: boolean; reviewId: string; message: string }> {
    const order = await this.getOrderById(orderId);
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Reviews can only be submitted after the order has been delivered.');
    }

    if (this.reviews.has(orderId)) {
      throw new ConflictException('A review has already been submitted for this order.');
    }

    const reviewId = `rev_${Date.now()}`;
    const reviewRecord = {
      id: reviewId,
      orderId,
      userId,
      restaurantId: order.restaurantId,
      driverId: order.driverId,
      foodRating: input.foodRating,
      driverRating: input.driverRating,
      foodReview: input.foodReview,
      driverReview: input.driverReview,
      complimentTags: input.complimentTags || [],
      createdAt: Date.now(),
    };

    this.reviews.set(orderId, reviewRecord);

    // Sync review to Supabase
    this.syncReviewToSupabase(reviewRecord).catch(err => console.warn('Supabase review sync error:', err));

    return {
      success: true,
      reviewId,
      message: 'Dual rating and feedback submitted successfully.',
    };
  }

  async addTip(orderId: string, userId: string, input: AddTipInput): Promise<OrderType> {
    const order = await this.getOrderById(orderId);
    const addedTip = input.tipAmount;

    order.driverTip += addedTip;
    order.totalAmount = parseFloat((order.totalAmount + addedTip).toFixed(2));
    // 100% of driver tip is disbursed directly to driver's payout ledger
    order.split.driverPayout = parseFloat((order.split.driverPayout + addedTip).toFixed(2));
    order.split.vendorDriverTotalPayout = parseFloat((order.split.vendorDriverTotalPayout + addedTip).toFixed(2));
    order.updatedAt = Date.now();

    this.orders.set(orderId, order);
    return order;
  }

  // ==========================================
  // 7. SUPABASE DATABASE SYNCHRONIZATION HELPERS
  // ==========================================
  private async syncOrderToSupabase(order: OrderType) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return;

    try {
      await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify([
          {
            id: order.id.startsWith('ord_') ? undefined : order.id,
            user_id: order.userId,
            restaurant_id: order.restaurantId,
            driver_id: order.driverId,
            status: order.status,
            subtotal: order.subtotal,
            tax_amount: order.taxAmount,
            delivery_fee: order.deliveryFee,
            driver_tip: order.driverTip,
            platform_commission_amount: order.split.platformCommission,
            restaurant_payout_amount: order.split.restaurantPayout,
            driver_payout_amount: order.split.driverPayout,
            total_amount: order.totalAmount,
            delivery_notes: order.deliveryNotes,
            destination_location: 'POINT(77.5946 12.9716)',
          },
        ]),
      });
    } catch {}
  }

  private async syncOrderStatusToSupabase(orderId: string, status: OrderStatus) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return;

    try {
      await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
        method: 'PATCH',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
      });
    } catch {}
  }

  private async syncReviewToSupabase(review: any) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return;

    try {
      await fetch(`${supabaseUrl}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify([
          {
            order_id: review.orderId,
            user_id: review.userId,
            restaurant_id: review.restaurantId,
            driver_id: review.driverId,
            food_rating: review.foodRating,
            driver_rating: review.driverRating,
            food_review: review.foodReview,
            driver_review: review.driverReview,
            compliment_tags: review.complimentTags,
          },
        ]),
      });
    } catch {}
  }
}
