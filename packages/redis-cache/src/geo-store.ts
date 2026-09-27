import { DriverUnavailableException } from '@repo/shared-utils';
import {
  DRIVER_HEARTBEAT_TTL_SECONDS,
  REDIS_KEYS,
  RESTAURANT_MAX_DISCOVERY_RADIUS_KM,
} from './redis.constants';
import { RedisClientWrapper } from './redis.client';

export interface RestaurantMeta {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  prepTimeMinutes: number;
  bannerUrl: string;
  isOpen: boolean;
  minimumOrder: number;
  deliveryFee: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface NearbyRestaurantResult {
  restaurant: RestaurantMeta;
  distanceKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DriverMeta {
  driverId: string;
  name: string;
  phone: string;
  vehicleType: string;
  rating: number;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE' | string;
}

export interface NearbyDriverResult {
  driverId: string;
  distanceKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  meta?: DriverMeta;
}

export class RedisGeoStore {
  constructor(private readonly redisWrapper: RedisClientWrapper) {}

  // ==========================================
  // 1. RESTAURANT GEOSPATIAL STORAGE & LOOKUP
  // ==========================================

  async indexRestaurant(restaurant: RestaurantMeta): Promise<void> {
    const client = this.redisWrapper.getClient();
    const { lat, lng } = restaurant.location;

    // 1. Add coordinate into Redis Geospatial index
    await client.geoadd(REDIS_KEYS.RESTAURANTS_GEO, lng, lat, restaurant.id);

    // 2. Cache metadata for rapid sub-millisecond hydration
    const metaKey = `${REDIS_KEYS.RESTAURANT_META_PREFIX}${restaurant.id}:meta`;
    await client.set(metaKey, JSON.stringify(restaurant));
  }

  async removeRestaurant(restaurantId: string): Promise<void> {
    const client = this.redisWrapper.getClient();
    await client.zrem(REDIS_KEYS.RESTAURANTS_GEO, restaurantId);
    await client.del(`${REDIS_KEYS.RESTAURANT_META_PREFIX}${restaurantId}:meta`);
  }

  async findNearbyRestaurants(
    userLat: number,
    userLng: number,
    radiusKm = RESTAURANT_MAX_DISCOVERY_RADIUS_KM,
  ): Promise<NearbyRestaurantResult[]> {
    const client = this.redisWrapper.getClient();
    // Enforce constant radius constraint <= 10 km
    const clampedRadius = Math.min(radiusKm, RESTAURANT_MAX_DISCOVERY_RADIUS_KM);

    // Execute sub-millisecond geosearch
    const rawMatches = await (client as any).geosearch(
      REDIS_KEYS.RESTAURANTS_GEO,
      'FROMLONLAT',
      userLng,
      userLat,
      'BYRADIUS',
      clampedRadius,
      'km',
      'ASC',
      'WITHDIST',
      'WITHCOORD',
    );

    if (!Array.isArray(rawMatches) || rawMatches.length === 0) {
      return [];
    }

    const results: NearbyRestaurantResult[] = [];

    for (const item of rawMatches) {
      const restId = item[0];
      const distanceKm = parseFloat(item[1]);
      const coords = item[2]
        ? { lng: parseFloat(item[2][0]), lat: parseFloat(item[2][1]) }
        : { lng: userLng, lat: userLat };

      // Hydrate metadata from cache
      const metaKey = `${REDIS_KEYS.RESTAURANT_META_PREFIX}${restId}:meta`;
      const metaRaw = await client.get(metaKey);
      let metadata: RestaurantMeta;

      if (metaRaw) {
        try {
          metadata = JSON.parse(metaRaw);
        } catch {
          metadata = this.getFallbackMeta(restId, coords);
        }
      } else {
        metadata = this.getFallbackMeta(restId, coords);
      }

      results.push({
        restaurant: metadata,
        distanceKm,
        coordinates: coords,
      });
    }

    return results;
  }

  private getFallbackMeta(id: string, coords: { lat: number; lng: number }): RestaurantMeta {
    return {
      id,
      name: `Restaurant ${id}`,
      cuisine: ['Fast Food'],
      rating: 4.5,
      prepTimeMinutes: 25,
      bannerUrl: '',
      isOpen: true,
      minimumOrder: 10,
      deliveryFee: 2.99,
      location: { ...coords },
    };
  }

  // ==========================================
  // 2. DELIVERY FLEET TRACKING & ASSIGNMENT
  // ==========================================

  async updateDriverLocation(
    driverId: string,
    lat: number,
    lng: number,
    status: 'ONLINE' | 'BUSY' | 'OFFLINE' = 'ONLINE',
    meta?: Partial<DriverMeta>,
  ): Promise<void> {
    const client = this.redisWrapper.getClient();

    if (status === 'ONLINE') {
      // Add or update live coordinate in available pool
      await client.geoadd(REDIS_KEYS.DRIVERS_AVAILABLE_GEO, lng, lat, driverId);
      // Set status with heartbeat TTL
      await client.set(
        `${REDIS_KEYS.DRIVER_STATUS_PREFIX}${driverId}:status`,
        'ONLINE',
        'EX',
        DRIVER_HEARTBEAT_TTL_SECONDS,
      );
    } else {
      // Remove from available dispatch set if busy or offline
      await client.zrem(REDIS_KEYS.DRIVERS_AVAILABLE_GEO, driverId);
      await client.set(
        `${REDIS_KEYS.DRIVER_STATUS_PREFIX}${driverId}:status`,
        status,
        'EX',
        DRIVER_HEARTBEAT_TTL_SECONDS,
      );
    }

    if (meta) {
      const existingMetaRaw = await client.get(`${REDIS_KEYS.DRIVER_STATUS_PREFIX}${driverId}:meta`);
      const existing = existingMetaRaw ? JSON.parse(existingMetaRaw) : {};
      await client.set(
        `${REDIS_KEYS.DRIVER_STATUS_PREFIX}${driverId}:meta`,
        JSON.stringify({ ...existing, ...meta, driverId, status }),
      );
    }
  }

  async findCandidateDrivers(
    restLat: number,
    restLng: number,
    radiusKm = 5,
    limit = 5,
  ): Promise<NearbyDriverResult[]> {
    const client = this.redisWrapper.getClient();

    const rawDrivers = await (client as any).geosearch(
      REDIS_KEYS.DRIVERS_AVAILABLE_GEO,
      'FROMLONLAT',
      restLng,
      restLat,
      'BYRADIUS',
      radiusKm,
      'km',
      'ASC',
      'WITHDIST',
      'WITHCOORD',
      'COUNT',
      limit,
    );

    if (!Array.isArray(rawDrivers) || rawDrivers.length === 0) {
      return [];
    }

    const candidates: NearbyDriverResult[] = [];

    for (const item of rawDrivers) {
      const driverId = item[0];
      const distanceKm = parseFloat(item[1]);
      const coords = item[2]
        ? { lng: parseFloat(item[2][0]), lat: parseFloat(item[2][1]) }
        : { lng: restLng, lat: restLat };

      const metaRaw = await client.get(`${REDIS_KEYS.DRIVER_STATUS_PREFIX}${driverId}:meta`);
      let meta: DriverMeta | undefined;
      if (metaRaw) {
        try {
          meta = JSON.parse(metaRaw);
        } catch {
          // ignore
        }
      }

      candidates.push({
        driverId,
        distanceKm,
        coordinates: coords,
        meta,
      });
    }

    return candidates;
  }

  async atomicAssignDriver(
    orderId: string,
    restLat: number,
    restLng: number,
    searchRadiusKm = 5,
  ): Promise<{ assignedDriverId: string; distanceKm: number }> {
    const client = this.redisWrapper.getClient();
    const candidates = await this.findCandidateDrivers(restLat, restLng, searchRadiusKm, 5);

    if (candidates.length === 0) {
      throw new DriverUnavailableException(orderId, searchRadiusKm);
    }

    // Attempt atomic reservation on closest available candidate
    for (const candidate of candidates) {
      const driverId = candidate.driverId;
      // 1. Remove from available set to prevent other concurrent assignments
      const removed = await client.zrem(REDIS_KEYS.DRIVERS_AVAILABLE_GEO, driverId);
      if (removed > 0) {
        // Driver was successfully claimed
        await client.set(
          `${REDIS_KEYS.DRIVER_STATUS_PREFIX}${driverId}:status`,
          `ASSIGNED_TO_ORDER_${orderId}`,
          'EX',
          1800, // 30 minutes reservation
        );

        return {
          assignedDriverId: driverId,
          distanceKm: candidate.distanceKm,
        };
      }
    }

    throw new DriverUnavailableException(orderId, searchRadiusKm);
  }
}
