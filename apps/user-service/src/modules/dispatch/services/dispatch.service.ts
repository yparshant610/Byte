import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RedisGeoStore } from '@repo/redis-cache';
import { REDIS_GEO_STORE } from '../../redis/redis-provider.module';
import {
  AssignOrderInputDto,
  AssignOrderResponseDto,
  DriverLocationDto,
} from '../models/dispatch.models';

@Injectable()
export class DispatchService implements OnModuleInit {
  constructor(
    @Inject(REDIS_GEO_STORE)
    private readonly geoStore: RedisGeoStore,
  ) {}

  async onModuleInit() {
    // Seed test available drivers near MG Road & Tony's Pizza
    await this.geoStore.updateDriverLocation('driver_rajesh_01', 12.9770, 77.6010, 'ONLINE', {
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      vehicleType: 'EV Scooter',
      rating: 4.9,
    });

    await this.geoStore.updateDriverLocation('driver_vikram_02', 12.9755, 77.6030, 'ONLINE', {
      name: 'Vikram Singh',
      phone: '+919876543211',
      vehicleType: 'Motorcycle',
      rating: 4.7,
    });
  }

  async updateLocation(input: DriverLocationDto): Promise<{ success: boolean }> {
    await this.geoStore.updateDriverLocation(
      input.driverId,
      input.lat,
      input.lng,
      input.status || 'ONLINE',
    );
    return { success: true };
  }

  async assignDriver(
    orderId: string,
    input: AssignOrderInputDto,
  ): Promise<AssignOrderResponseDto> {
    const radius = input.radiusKm || 5;
    const assignment = await this.geoStore.atomicAssignDriver(
      orderId,
      input.restaurantLat,
      input.restaurantLng,
      radius,
    );

    return {
      orderId,
      assignedDriverId: assignment.assignedDriverId,
      distanceKm: assignment.distanceKm,
      status: 'ASSIGNED',
    };
  }
}
