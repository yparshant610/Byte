import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto, DriverLocationBroadcastDto, OrderStatus } from '../models/order.models';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // console.log(`[Socket] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // console.log(`[Socket] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_order')
  handleJoinOrder(@ConnectedSocket() client: Socket, @MessageBody() data: { orderId: string }) {
    if (data?.orderId) {
      const room = `order_${data.orderId}`;
      client.join(room);
      return { event: 'joined_order', room };
    }
  }

  @SubscribeMessage('leave_order')
  handleLeaveOrder(@ConnectedSocket() client: Socket, @MessageBody() data: { orderId: string }) {
    if (data?.orderId) {
      const room = `order_${data.orderId}`;
      client.leave(room);
      return { event: 'left_order', room };
    }
  }

  // --- Real-time Order Status Broadcast ---
  broadcastOrderStatusUpdated(orderId: string, payload: { previousStatus: OrderStatus; newStatus: OrderStatus; updatedBy: string; timestamp: number }) {
    if (this.server) {
      this.server.to(`order_${orderId}`).emit('order:status_updated', {
        orderId,
        ...payload,
      });
    }
  }

  // --- Real-time Driver Telemetry Broadcast ---
  @SubscribeMessage('driver:location_update')
  handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: DriverLocationBroadcastDto,
  ) {
    this.broadcastDriverLocation(data);
    return { status: 'broadcasted' };
  }

  broadcastDriverLocation(data: DriverLocationBroadcastDto) {
    if (this.server && data?.orderId) {
      this.server.to(`order_${data.orderId}`).emit('driver:location_broadcast', {
        orderId: data.orderId,
        driverId: data.driverId,
        lat: data.lat,
        lng: data.lng,
        bearing: data.bearing || 0,
        speed: data.speed || 0,
        timestamp: Date.now(),
      });
    }
  }

  // --- Bidirectional Courier Chat Broadcast ---
  @SubscribeMessage('courier:send_message')
  handleCourierMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessageDto & { senderRole: 'CUSTOMER' | 'DRIVER'; senderId: string },
  ) {
    if (this.server && data?.orderId) {
      const messagePayload = {
        orderId: data.orderId,
        senderId: data.senderId,
        senderRole: data.senderRole,
        message: data.message,
        timestamp: Date.now(),
      };
      this.server.to(`order_${data.orderId}`).emit('courier:message_sent', messagePayload);
      return { status: 'delivered', messagePayload };
    }
  }
}
