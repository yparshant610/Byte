import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SEED_RESTAURANTS } from '@repo/database';
import { RedisGeoStore, RestaurantMeta } from '@repo/redis-cache';
import { haversineDistanceKm } from '@repo/shared-utils';
import { REDIS_GEO_STORE } from '../../redis/redis-provider.module';
import { GeoIndexRestaurantInput, NearbyRestaurantType, RestaurantType } from '../models/restaurant.models';

@Injectable()
export class RestaurantService implements OnModuleInit {
  constructor(
    @Inject(REDIS_GEO_STORE)
    private readonly geoStore: RedisGeoStore,
  ) {}

  async onModuleInit() {
    await this.warmupCache();
  }

  async warmupCache(): Promise<void> {
    // 1. Warm up Redis Geospatial index with seed restaurants
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

    // 2. Also sync from live Supabase if credentials are present
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/restaurants?select=*`, {
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
        });
        if (res.ok) {
          const rows = await res.json();
          for (const row of rows) {
            // If location is EWKB or we have seed coordinates
            const seed = SEED_RESTAURANTS.find(s => s.id === row.id);
            const lat = seed ? seed.latitude : 12.9780;
            const lng = seed ? seed.longitude : 77.6000;
            const meta: RestaurantMeta = {
              id: row.id,
              name: row.name,
              cuisine: row.cuisine_types || ['Multi-cuisine'],
              rating: Number(row.rating || 4.5),
              prepTimeMinutes: row.average_prep_time_minutes || 25,
              bannerUrl: row.banner_url || '',
              isOpen: row.operational_status === 'ACTIVE',
              minimumOrder: Number(row.minimum_order_amount || 10),
              deliveryFee: Number(row.delivery_fee_base || 2.49),
              location: {
                lat,
                lng,
                address: row.street_address,
              },
            };
            if (meta.isOpen) {
              await this.geoStore.indexRestaurant(meta);
            }
          }
        }
      } catch (e) {
        // Fallback to memory seed completed
      }
    }
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm = 10,
  ): Promise<NearbyRestaurantType[]> {
    // Enforce <= 10 km constant radius constraint
    const clampedRadius = Math.min(radiusKm, 10);
    let results = await this.geoStore.findNearbyRestaurants(lat, lng, clampedRadius);

    // Fallback pipeline: if Redis returns 0, re-warm cache and compute mathematically
    if (results.length === 0) {
      await this.warmupCache();
      results = await this.geoStore.findNearbyRestaurants(lat, lng, clampedRadius);

      // Secondary mathematical fallback via Haversine if Redis is still cold
      if (results.length === 0) {
        for (const s of SEED_RESTAURANTS) {
          const dist = haversineDistanceKm({ lat, lng }, { lat: s.latitude, lng: s.longitude });
          if (dist <= clampedRadius && s.operationalStatus === 'ACTIVE') {
            const meta: RestaurantMeta = {
              id: s.id,
              name: s.name,
              cuisine: s.cuisineTypes,
              rating: Number(s.rating),
              prepTimeMinutes: s.averagePrepTimeMinutes,
              bannerUrl: s.bannerUrl || '',
              isOpen: true,
              minimumOrder: Number(s.minimumOrderAmount),
              deliveryFee: Number(s.deliveryFeeBase),
              location: { lat: s.latitude, lng: s.longitude, address: s.streetAddress },
            };
            results.push({
              restaurant: meta,
              distanceKm: parseFloat(dist.toFixed(4)),
              coordinates: { lat: s.latitude, lng: s.longitude },
            });
          }
        }
        results.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

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
    // 1. Try Redis metadata cache first (sub-millisecond)
    const cached = await this.geoStore.getRestaurantMeta(id);
    if (cached) {
      return {
        id: cached.id,
        name: cached.name,
        cuisine: cached.cuisine,
        rating: cached.rating,
        prepTimeMinutes: cached.prepTimeMinutes,
        bannerUrl: cached.bannerUrl,
        isOpen: cached.isOpen,
        minimumOrder: cached.minimumOrder,
        deliveryFee: cached.deliveryFee,
        location: {
          lat: cached.location.lat,
          lng: cached.location.lng,
          address: cached.location.address,
        },
      };
    }

    // 2. Fallback to seed
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

  async syncGeoIndex(input: GeoIndexRestaurantInput): Promise<{ success: boolean; action: string }> {
    const status = input.operationalStatus || 'ACTIVE';

    if (status !== 'ACTIVE') {
      // Invalidate / remove from Redis Geospatial index when INACTIVE or SUSPENDED
      await this.geoStore.removeRestaurant(input.restaurantId);
      return { success: true, action: `REMOVED_FROM_INDEX_${status}` };
    }

    // Existing or provided coordinates
    const existing = await this.geoStore.getRestaurantMeta(input.restaurantId);
    const lat = input.lat ?? existing?.location.lat ?? 12.9780;
    const lng = input.lng ?? existing?.location.lng ?? 77.6000;

    const meta: RestaurantMeta = {
      id: input.restaurantId,
      name: input.name || existing?.name || `Restaurant ${input.restaurantId}`,
      cuisine: input.cuisine || existing?.cuisine || ['Multi-cuisine'],
      rating: input.rating ?? existing?.rating ?? 4.5,
      prepTimeMinutes: input.prepTimeMinutes ?? existing?.prepTimeMinutes ?? 25,
      bannerUrl: input.bannerUrl || existing?.bannerUrl || '',
      isOpen: true,
      minimumOrder: existing?.minimumOrder ?? 10,
      deliveryFee: existing?.deliveryFee ?? 2.49,
      location: {
        lat,
        lng,
        address: input.address || existing?.location.address,
      },
    };

    await this.geoStore.indexRestaurant(meta);
    return { success: true, action: 'INDEXED_IN_REDIS' };
  }
}
