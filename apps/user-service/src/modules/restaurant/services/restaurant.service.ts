import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SEED_RESTAURANTS } from '@repo/database';
import { RedisGeoStore, RestaurantMeta } from '@repo/redis-cache';
import { REDIS_GEO_STORE } from '../../redis/redis-provider.module';
import { NearbyRestaurantType, RestaurantType } from '../models/restaurant.models';

@Injectable()
export class RestaurantService implements OnModuleInit {
  constructor(
    @Inject(REDIS_GEO_STORE)
    private readonly geoStore: RedisGeoStore,
  ) {}

  async onModuleInit() {
    // Warm up Redis Geospatial index with seed restaurants
    for (const r of SEED_RESTAURANTS) {
      const meta: RestaurantMeta = {
        id: r.id,
        name: r.name,
        cuisine: r.cuisineTypes,
        rating: Number(r.rating),
        prepTimeMinutes: r.averagePrepTimeMinutes,
        bannerUrl: r.bannerUrl || '',
        isOpen: r.operationalStatus === 'ACTIVE',
        minimumOrder: Number(r.minimumOrderAmount),
        deliveryFee: Number(r.deliveryFeeBase),
        location: {
          lat: r.latitude,
          lng: r.longitude,
          address: r.streetAddress,
        },
      };
      await this.geoStore.indexRestaurant(meta);
    }
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm = 10,
  ): Promise<NearbyRestaurantType[]> {
    // Enforce <= 10 km constant radius constraint
    const clampedRadius = Math.min(radiusKm, 10);
    const results = await this.geoStore.findNearbyRestaurants(lat, lng, clampedRadius);

    return results.map(r => ({
      restaurant: {
        id: r.restaurant.id,
        name: r.restaurant.name,
        cuisine: r.restaurant.cuisine,
        rating: r.restaurant.rating,
        prepTimeMinutes: r.restaurant.prepTimeMinutes,
        bannerUrl: r.restaurant.bannerUrl,
        isOpen: r.restaurant.isOpen,
        minimumOrder: r.restaurant.minimumOrder,
        deliveryFee: r.restaurant.deliveryFee,
        location: {
          lat: r.restaurant.location.lat,
          lng: r.restaurant.location.lng,
          address: r.restaurant.location.address,
        },
      },
      distanceKm: r.distanceKm,
    }));
  }

  async getById(id: string): Promise<RestaurantType | null> {
    const seed = SEED_RESTAURANTS.find(r => r.id === id);
    if (!seed) return null;
    return {
      id: seed.id,
      name: seed.name,
      cuisine: seed.cuisineTypes,
      rating: Number(seed.rating),
      prepTimeMinutes: seed.averagePrepTimeMinutes,
      bannerUrl: seed.bannerUrl || '',
      isOpen: seed.operationalStatus === 'ACTIVE',
      minimumOrder: Number(seed.minimumOrderAmount),
      deliveryFee: Number(seed.deliveryFeeBase),
      location: {
        lat: seed.latitude,
        lng: seed.longitude,
        address: seed.streetAddress,
      },
    };
  }

  async indexRestaurant(meta: RestaurantMeta): Promise<void> {
    await this.geoStore.indexRestaurant(meta);
  }
}
