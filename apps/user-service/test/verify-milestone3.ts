import * as crypto from 'crypto';
import { io, Socket } from 'socket.io-client';

const API_BASE = 'http://localhost:4000/api/v1';
const WS_BASE = 'http://localhost:4000';

async function runMilestone3TestSuite() {
  console.log(`\n======================================================`);
  console.log(`🧪 RUNNING FOOD BYTE MILESTONE 3 E2E VERIFICATION SUITE`);
  console.log(`   Order Lifecycle, Dispatch, 80/20 Splits, Webhooks & WS`);
  console.log(`======================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorDetail?: any) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`, errorDetail || '');
      failed++;
    }
  }

  const testUserId = `user_m3_${Date.now()}`;
  const consumerHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': testUserId,
    'x-user-role': 'CONSUMER',
    Authorization: `Bearer mock_token_consumer_${testUserId}`,
  };

  const merchantHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': 'merchant_owner_01',
    'x-user-role': 'MERCHANT',
    Authorization: 'Bearer mock_token_merchant',
  };

  const driverHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': 'driver_rajesh_01',
    'x-user-role': 'DRIVER',
    Authorization: 'Bearer mock_token_driver',
  };

  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-user-id': 'admin_super_01',
    'x-user-role': 'ADMIN',
    Authorization: 'Bearer mock_token_admin',
  };

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: CART POPULATION & CHECKOUT WITH 80/20 SPLIT
    // -------------------------------------------------------------------------
    console.log(`\n--- [1] Testing Cart Checkout & 80/20 Variable Split Engine ---`);

    // 1.1 Add item to cart
    const cartRes = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: consumerHeaders,
      body: JSON.stringify({
        restaurantId: '30000000-0000-0000-0000-000000000001',
        restaurantName: "Tony's Artisan Pizza",
        itemId: '50000000-0000-0000-0000-000000000001',
        name: 'Truffle Mushroom Pizza',
        quantity: 2,
        basePrice: 15.00,
        selectedOptions: [
          { groupName: 'Size', choiceName: '14 inch Large', additionalPrice: 4.00 },
        ],
      }),
    });
    const cartData = await cartRes.json();
    // unitPrice = 15.00 + 4.00 = 19.00; total = 38.00
    assert((cartRes.status === 200 || cartRes.status === 201) && cartData.subtotal === 38.00, 'Item with options successfully added to cart ($38.00)');

    // 1.2 Checkout
    const checkoutRes = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: consumerHeaders,
      body: JSON.stringify({
        deliveryAddress: 'Penthouse 4B, MG Road Boulevard, Bangalore',
        destinationLat: 12.9716,
        destinationLng: 77.5946,
        deliveryNotes: 'Leave with front desk security',
        driverTip: 3.00,
      }),
    });
    const checkoutData = await checkoutRes.json();
    assert(checkoutRes.status === 201, `Checkout completed with HTTP 201 (got ${checkoutRes.status})`);

    const order = checkoutData.order;
    assert(!!order && !!order.id, `Order ID created: ${order?.id}`);
    assert(order.status === 'PENDING', `Order initial status is PENDING (${order?.status})`);
    assert(order.subtotal === 38.00, `Subtotal matches cart: $${order?.subtotal}`);
    assert(order.taxAmount === 1.90, `5% GST calculated: $${order?.taxAmount}`);
    assert(order.deliveryFee === 2.49, `Delivery fee standard: $${order?.deliveryFee}`);
    assert(order.driverTip === 3.00, `Driver tip recorded: $${order?.driverTip}`);

    // Check Total: 38 + 1.90 + 2.49 + 3.00 = 45.39
    assert(order.totalAmount === 45.39, `Total amount calculated correctly ($45.39 vs ${order?.totalAmount})`);

    // 1.3 Verify 80/20 Split Breakdown
    // Platform commission = (38.00 + 2.49) * 0.20 = 40.49 * 0.20 = 8.10
    // Restaurant payout = 38.00 * 0.80 = 30.40
    // Driver payout = (2.49 * 0.80) + 3.00 = 1.99 + 3.00 = 4.99
    // Vendor + Driver total = 30.40 + 4.99 = 35.39
    const split = order.split;
    assert(split.platformCommission === 8.10, `Byte Add platform commission is 20% ($8.10 vs ${split?.platformCommission})`);
    assert(split.restaurantPayout === 30.40, `Restaurant food payout is 80% ($30.40 vs ${split?.restaurantPayout})`);
    assert(split.driverPayout === 4.99, `Driver payout includes base fee + 100% tip ($4.99 vs ${split?.driverPayout})`);
    assert(split.vendorDriverTotalPayout === 35.39, `Vendor + Driver combined payout reconciled ($35.39 vs ${split?.vendorDriverTotalPayout})`);

    // 1.4 Verify Cart was wiped in Redis
    const checkCartRes = await fetch(`${API_BASE}/cart`, { headers: consumerHeaders });
    const checkCartText = await checkCartRes.text();
    const checkCartData = checkCartText ? JSON.parse(checkCartText) : null;
    assert(checkCartRes.status === 200 && (checkCartData === null || !checkCartText), 'Active Redis shopping cart automatically cleared after checkout');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: ORDER STATE MACHINE & ROLE-BASED TRANSITION GUARDS
    // -------------------------------------------------------------------------
    console.log(`\n--- [2] Testing Order State Machine & Role Guard Validation ---`);
    const activeOrderId = order.id;

    // 2.1 Consumer attempts to set PREPARING -> Must be FORBIDDEN (403)
    const illegalConsumerRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: consumerHeaders,
      body: JSON.stringify({ status: 'PREPARING' }),
    });
    assert(illegalConsumerRes.status === 403, `Consumer forbidden from initiating PREPARING status (got ${illegalConsumerRes.status})`);

    // 2.2 Merchant accepts order: PENDING -> ACCEPTED
    const acceptRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: merchantHeaders,
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });
    const acceptData = await acceptRes.json();
    assert(acceptRes.status === 200 && acceptData.status === 'ACCEPTED', 'Merchant transitioned order: PENDING -> ACCEPTED');

    // 2.3 Merchant begins preparation: ACCEPTED -> PREPARING
    const prepRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: merchantHeaders,
      body: JSON.stringify({ status: 'PREPARING' }),
    });
    const prepData = await prepRes.json();
    assert(prepRes.status === 200 && prepData.status === 'PREPARING', 'Merchant transitioned order: ACCEPTED -> PREPARING');

    // 2.4 Merchant finishes preparation: PREPARING -> READY_FOR_PICKUP
    const readyRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: merchantHeaders,
      body: JSON.stringify({ status: 'READY_FOR_PICKUP' }),
    });
    const readyData = await readyRes.json();
    assert(readyRes.status === 200 && readyData.status === 'READY_FOR_PICKUP', 'Merchant transitioned order: PREPARING -> READY_FOR_PICKUP');

    // 2.5 Consumer tries to cancel after preparation -> Must be BAD REQUEST (400)
    const illegalCancelRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: consumerHeaders,
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    assert(illegalCancelRes.status === 400, `Consumer cannot cancel order once food preparation has started (got ${illegalCancelRes.status})`);

    // 2.6 Driver picks up order: READY_FOR_PICKUP -> OUT_FOR_DELIVERY
    const pickupRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: driverHeaders,
      body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }),
    });
    const pickupData = await pickupRes.json();
    assert(pickupRes.status === 200 && pickupData.status === 'OUT_FOR_DELIVERY', 'Driver transitioned order: READY_FOR_PICKUP -> OUT_FOR_DELIVERY');

    // 2.7 Merchant tries to mark DELIVERED -> Must be BAD REQUEST (400, only driver can mark delivered)
    const illegalMerchantDeliverRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: merchantHeaders,
      body: JSON.stringify({ status: 'DELIVERED' }),
    });
    assert(illegalMerchantDeliverRes.status === 400, `Merchant cannot mark order DELIVERED (got ${illegalMerchantDeliverRes.status})`);

    // 2.8 Driver completes delivery: OUT_FOR_DELIVERY -> DELIVERED
    const deliverRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: driverHeaders,
      body: JSON.stringify({ status: 'DELIVERED' }),
    });
    const deliverData = await deliverRes.json();
    assert(deliverRes.status === 200 && deliverData.status === 'DELIVERED', 'Driver transitioned order: OUT_FOR_DELIVERY -> DELIVERED');

    // 2.9 Terminal state immutability: Cannot transition a DELIVERED order (409 Conflict)
    const terminalRes = await fetch(`${API_BASE}/orders/${activeOrderId}/status`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    assert(terminalRes.status === 409, `Delivered order terminal state is immutable (got 409 Conflict)`);

    // -------------------------------------------------------------------------
    // TEST SUITE 3: DRIVER TIP TOP-UP & LEDGER ALLOCATION
    // -------------------------------------------------------------------------
    console.log(`\n--- [3] Testing Post-Order Driver Tip Top-Up ---`);
    const tipRes = await fetch(`${API_BASE}/orders/${activeOrderId}/tip`, {
      method: 'POST',
      headers: consumerHeaders,
      body: JSON.stringify({ tipAmount: 5.00 }),
    });
    const tipData = await tipRes.json();
    assert(tipRes.status === 200, `Tip top-up added successfully with HTTP 200`);
    assert(tipData.driverTip === 8.00, `Order total driver tip updated ($3.00 + $5.00 = $${tipData.driverTip})`);
    assert(tipData.totalAmount === 50.39, `Order total updated ($45.39 + $5.00 = $${tipData.totalAmount})`);
    assert(tipData.split.driverPayout === 9.99, `100% of driver tip added directly to driver payout ($4.99 + $5.00 = $${tipData.split.driverPayout})`);
    assert(tipData.split.platformCommission === 8.10, `Platform commission remained unchanged at $8.10 (0% commission on tips)`);

    // -------------------------------------------------------------------------
    // TEST SUITE 4: DUAL STAR REVIEWS & FEEDBACK
    // -------------------------------------------------------------------------
    console.log(`\n--- [4] Testing Dual Star Ratings (Restaurant Food & Driver Delivery) ---`);

    // 4.1 Submit dual review on delivered order
    const reviewRes = await fetch(`${API_BASE}/orders/${activeOrderId}/reviews`, {
      method: 'POST',
      headers: consumerHeaders,
      body: JSON.stringify({
        foodRating: 5,
        driverRating: 5,
        foodReview: 'The truffle oil fragrance and crispy crust were out of this world!',
        driverReview: 'Courteous, arrived with steam still rising from the box.',
        complimentTags: ['Fast Delivery', 'Great Packaging', 'Fresh Food'],
      }),
    });
    const reviewData = await reviewRes.json();
    assert(reviewRes.status === 201 && reviewData.success === true, `Dual rating submitted successfully: ${reviewData.reviewId}`);

    // 4.2 Duplicate review prevention (409 Conflict)
    const duplicateReviewRes = await fetch(`${API_BASE}/orders/${activeOrderId}/reviews`, {
      method: 'POST',
      headers: consumerHeaders,
      body: JSON.stringify({
        foodRating: 4,
        driverRating: 4,
      }),
    });
    assert(duplicateReviewRes.status === 409, `Duplicate review on same order rejected with 409 Conflict`);

    // -------------------------------------------------------------------------
    // TEST SUITE 5: RAZORPAY WEBHOOK & HMAC-SHA256 SIGNATURE VALIDATION
    // -------------------------------------------------------------------------
    console.log(`\n--- [5] Testing Razorpay Webhook & Signature Verification ---`);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_test';

    // 5.1 Create a fresh pending order specifically for webhook payment capture
    const webhookUser = `user_webhook_${Date.now()}`;
    const webhookUserHeaders = {
      'Content-Type': 'application/json',
      'x-user-id': webhookUser,
      'x-user-role': 'CONSUMER',
      Authorization: `Bearer mock_token_${webhookUser}`,
    };
    await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: webhookUserHeaders,
      body: JSON.stringify({
        restaurantId: '30000000-0000-0000-0000-000000000001',
        restaurantName: "Tony's Artisan Pizza",
        itemId: '50000000-0000-0000-0000-000000000001',
        name: 'Classic Margherita',
        quantity: 1,
        basePrice: 12.00,
      }),
    });
    const webhookCheckoutRes = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: webhookUserHeaders,
      body: JSON.stringify({
        destinationLat: 12.9716,
        destinationLng: 77.5946,
      }),
    });
    const webhookOrder = (await webhookCheckoutRes.json()).order;
    assert(webhookOrder.status === 'PENDING', `Fresh webhook test order created in PENDING state (${webhookOrder.id})`);

    // 5.2 Test with valid HMAC-SHA256 signature
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_rzp_${Date.now()}`,
            amount: Math.round(webhookOrder.totalAmount * 100),
            currency: 'INR',
            status: 'captured',
            notes: {
              orderId: webhookOrder.id,
            },
          },
        },
      },
    };
    const rawPayloadString = JSON.stringify(webhookPayload);
    const validSignature = crypto.createHmac('sha256', secret).update(rawPayloadString).digest('hex');

    const validWebhookRes = await fetch(`${API_BASE}/payments/razorpay-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': validSignature,
      },
      body: rawPayloadString,
    });
    const validWebhookData = await validWebhookRes.json();
    assert(validWebhookRes.status === 200 && validWebhookData.received === true, `Razorpay payment.captured accepted with valid HMAC signature`);

    // Verify order transitioned to ACCEPTED via webhook
    const updatedWebhookOrderRes = await fetch(`${API_BASE}/orders/${webhookOrder.id}`);
    const updatedWebhookOrder = await updatedWebhookOrderRes.json();
    assert(updatedWebhookOrder.status === 'ACCEPTED', `Webhook automatically advanced order status to ACCEPTED (${updatedWebhookOrder.status})`);

    // 5.3 Test with invalid/forged signature -> Must be FORBIDDEN (403)
    const invalidWebhookRes = await fetch(`${API_BASE}/payments/razorpay-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'forged_fake_signature_hex_12345',
      },
      body: rawPayloadString,
    });
    assert(invalidWebhookRes.status === 403, `Forged webhook signature rejected with 403 Forbidden`);

    // -------------------------------------------------------------------------
    // TEST SUITE 6: ADMIN REFUND & DISPUTE RECONCILIATION
    // -------------------------------------------------------------------------
    console.log(`\n--- [6] Testing Admin Refund & Dispute Reconciliation ---`);

    // 6.1 Create fresh order for refund dispute flow
    const refundUser = `user_refund_${Date.now()}`;
    const refundUserHeaders = {
      'Content-Type': 'application/json',
      'x-user-id': refundUser,
      'x-user-role': 'CONSUMER',
      Authorization: `Bearer mock_token_${refundUser}`,
    };
    await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: refundUserHeaders,
      body: JSON.stringify({
        restaurantId: '30000000-0000-0000-0000-000000000001',
        restaurantName: "Tony's Artisan Pizza",
        itemId: '50000000-0000-0000-0000-000000000001',
        name: 'Prosciutto e Funghi',
        quantity: 1,
        basePrice: 18.00,
      }),
    });
    const refundCheckoutRes = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: refundUserHeaders,
      body: JSON.stringify({
        destinationLat: 12.9716,
        destinationLng: 77.5946,
      }),
    });
    const orderToRefund = (await refundCheckoutRes.json()).order;

    // 6.2 Non-admin attempts refund -> Must be FORBIDDEN (403)
    const unauthorizedRefundRes = await fetch(`${API_BASE}/orders/${orderToRefund.id}/refund`, {
      method: 'POST',
      headers: consumerHeaders,
      body: JSON.stringify({ reason: 'Accidental order' }),
    });
    assert(unauthorizedRefundRes.status === 403, `Non-admin user forbidden from authorizing refunds (got 403)`);

    // 6.3 Admin processes legitimate refund
    const adminRefundRes = await fetch(`${API_BASE}/orders/${orderToRefund.id}/refund`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        amount: orderToRefund.totalAmount,
        reason: 'Customer reported missing item or damaged delivery box',
      }),
    });
    const adminRefundData = await adminRefundRes.json();
    assert(adminRefundRes.status === 200 && adminRefundData.success === true, `Admin authorized refund successfully: $${adminRefundData.refundedAmount}`);

    // Verify order was transitioned to CANCELLED
    const sampleOrderRes = await fetch(`${API_BASE}/orders/${orderToRefund.id}`);
    const sampleOrderData = await sampleOrderRes.json();
    assert(sampleOrderData.status === 'CANCELLED', `Refunded order status transitioned to CANCELLED (${sampleOrderData.status})`);

    // -------------------------------------------------------------------------
    // TEST SUITE 7: REAL-TIME WEBSOCKET GATEWAY & LIVE TELEMETRY
    // -------------------------------------------------------------------------
    console.log(`\n--- [7] Testing Real-Time WebSocket Gateway & Telemetry Events ---`);

    const socket: Socket = io(WS_BASE, {
      transports: ['websocket'],
      reconnection: false,
    });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timed out after 5000ms'));
      }, 5000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        assert(socket.connected, `Socket.io client connected with ID: ${socket.id}`);
        resolve();
      });

      socket.on('connect_error', err => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    // 7.1 Join Order Room
    socket.emit('join_order', { orderId: 'ord_sample_101' });

    // 7.2 Test Driver Telemetry Location Broadcast
    const telemetryPromise = new Promise<any>(resolve => {
      socket.on('driver:location_broadcast', data => {
        resolve(data);
      });
    });

    socket.emit('driver:location_update', {
      orderId: 'ord_sample_101',
      driverId: '80000000-0000-0000-0000-000000000001',
      lat: 12.9772,
      lng: 77.6008,
      bearing: 180,
      speed: 28.5,
    });

    const receivedTelemetry = await Promise.race([
      telemetryPromise,
      new Promise<null>(res => setTimeout(() => res(null), 3000)),
    ]);

    assert(
      receivedTelemetry !== null && receivedTelemetry.driverId === '80000000-0000-0000-0000-000000000001',
      `Live driver GPS telemetry broadcast received via WebSocket (lat: ${receivedTelemetry?.lat}, lng: ${receivedTelemetry?.lng}, speed: ${receivedTelemetry?.speed} km/h)`,
    );

    // 7.3 Test Courier-Consumer In-App Chat
    const chatPromise = new Promise<any>(resolve => {
      socket.on('courier:message_sent', data => {
        resolve(data);
      });
    });

    socket.emit('courier:send_message', {
      orderId: 'ord_sample_101',
      senderId: 'driver_rajesh_01',
      senderRole: 'DRIVER',
      message: 'I have arrived at the lobby with your order.',
    });

    const receivedChat = await Promise.race([
      chatPromise,
      new Promise<null>(res => setTimeout(() => res(null), 3000)),
    ]);

    assert(
      receivedChat !== null && receivedChat.message === 'I have arrived at the lobby with your order.',
      `Bidirectional chat message delivered in real-time (${receivedChat?.senderRole}: "${receivedChat?.message}")`,
    );

    socket.disconnect();
    console.log(`🔌 WebSocket client disconnected cleanly.`);

  } catch (error: any) {
    console.error('Unhandled error during test suite:', error);
    failed++;
  }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log(`\n======================================================`);
  console.log(`📊 MILESTONE 3 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runMilestone3TestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
