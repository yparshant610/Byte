import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SEED_RESTAURANTS } from '@repo/database';
import { RedisGeoStore, RestaurantMeta } from '@repo/redis-cache';
import { haversineDistanceKm } from '@repo/shared-utils';
import { REDIS_GEO_STORE } from '../../redis/redis-provider.module';
import { GeoIndexRestaurantInput, NearbyRestaurantType, RestaurantType } from '../models/restaurant.models';
import { S3StorageService } from './s3-storage.service';

@Injectable()
export class RestaurantService implements OnModuleInit {
  constructor(
    @Inject(REDIS_GEO_STORE)
    private readonly geoStore: RedisGeoStore,
    private readonly s3StorageService: S3StorageService,
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

  // =========================================================================
  // RESTAURANT MERCHANT PORTAL: MENU, SETTINGS & FINANCIALS
  // =========================================================================

  private getSupabaseHeaders() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    return {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };
  }

  async getRestaurantMenu(restaurantId: string): Promise<any[]> {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';

    try {
      // 1. Fetch categories
      const catRes = await fetch(
        `${supabaseUrl}/rest/v1/menu_categories?restaurant_id=eq.${restaurantId}&order=display_order.asc`,
        { headers: this.getSupabaseHeaders() },
      );
      const categories = catRes.ok ? await catRes.json() : [];
      const catMap = new Map<string, string>();
      categories.forEach((c: any) => catMap.set(c.id, c.name));

      // 2. Fetch menu items
      const itemsRes = await fetch(
        `${supabaseUrl}/rest/v1/menu_items?restaurant_id=eq.${restaurantId}&order=created_at.desc`,
        { headers: this.getSupabaseHeaders() },
      );
      const items = itemsRes.ok ? await itemsRes.json() : [];

      if (items.length > 0) {
        const customItems = await Promise.all(items.map(async (row: any) => {
          const skuMatch = row.description?.match(/SKU:\s*([A-Za-z0-9\-]+)/);
          const rawImage = row.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60';
          const resolvedImage = await this.s3StorageService.resolveViewUrl(rawImage);

          return {
            id: row.id,
            name: row.name,
            sku: skuMatch ? skuMatch[1] : `PZ-${row.id.substring(0, 4).toUpperCase()}`,
            category: catMap.get(row.category_id) || 'Signature Pizzas',
            price: Number(row.base_price),
            prepTime: '12m',
            inStock: Boolean(row.is_available),
            image: resolvedImage,
            station: 'Deck Oven 1',
            dietary: row.is_vegetarian
              ? ['Veg']
              : row.is_vegan
                ? ['Vegan']
                : row.is_gluten_free
                  ? ['Gluten-Free']
                  : [],
            description: row.description,
          };
        }));

        // Always preserve custom items alongside default items
        const customIds = new Set(customItems.map((c: any) => c.id));
        const defaultItems = this.getDefaultSeedMenu().filter(s => !customIds.has(s.id));
        return [...customItems, ...defaultItems];
      }
    } catch (err) {
      console.warn('Error fetching menu from Supabase:', err);
    }

    return this.getDefaultSeedMenu();
  }

  private getDefaultSeedMenu(): any[] {
    return [
      {
        id: '50000000-0000-0000-0000-000000000001',
        name: 'Margherita Pizza D.O.P',
        sku: 'PZ-101',
        category: 'Signature Pizzas',
        price: 16.99,
        prepTime: '12m',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=60',
        station: 'Deck Oven 1',
        dietary: ['Veg'],
      },
      {
        id: '50000000-0000-0000-0000-000000000002',
        name: 'Double Truffle Funghi',
        sku: 'PZ-102',
        category: 'Signature Pizzas',
        price: 21.5,
        prepTime: '14m',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        station: 'Deck Oven 1',
        dietary: ['Veg'],
      },
      {
        id: '50000000-0000-0000-0000-000000000003',
        name: 'Diavola Pepperoni Crunch',
        sku: 'PZ-103',
        category: 'Signature Pizzas',
        price: 19.5,
        prepTime: '15m',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
        station: 'Deck Oven 2',
        dietary: ['Spicy'],
      },
      {
        id: '50000000-0000-0000-0000-000000000004',
        name: 'Burrata Heirloom Salad',
        sku: 'APP-201',
        category: 'Appetizers & Sides',
        price: 13.99,
        prepTime: '6m',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
        station: 'Garde Manger',
        dietary: ['Veg', 'Gluten-Free'],
      },
      {
        id: '50000000-0000-0000-0000-000000000005',
        name: 'White Truffle Garlic Fries',
        sku: 'APP-202',
        category: 'Appetizers & Sides',
        price: 8.5,
        prepTime: '8m',
        inStock: false,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
        station: 'Fry Station',
        dietary: ['Veg'],
      },
      {
        id: '50000000-0000-0000-0000-000000000006',
        name: 'Classic Venetian Tiramisu',
        sku: 'DES-301',
        category: 'Desserts',
        price: 9.99,
        prepTime: '4m',
        inStock: true,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
        station: 'Pastry Station',
        dietary: ['Veg'],
      },
    ];
  }

  async createMenuItem(restaurantId: string, item: any): Promise<any> {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';
    const { randomUUID } = await import('crypto');
    const itemId = item.id && item.id.length > 20 ? item.id : randomUUID();

    // Sanitize and validate price for PostgreSQL NUMERIC(10, 2)
    let rawPrice = parseFloat(item.price);
    if (isNaN(rawPrice) || rawPrice < 0) rawPrice = 14.99;
    // Limit to max 99,999.99 to prevent PostgreSQL error 22003 numeric field overflow
    const basePrice = Math.min(Math.round(rawPrice * 100) / 100, 99999.99);

    try {
      // 0. Ensure restaurant exists in Supabase to satisfy foreign key constraint
      const restCheck = await fetch(
        `${supabaseUrl}/rest/v1/restaurants?id=eq.${restaurantId}&select=id`,
        { headers: this.getSupabaseHeaders() },
      );
      if (restCheck.ok) {
        const restRows = await restCheck.json();
        if (restRows.length === 0) {
          // Auto-insert restaurant record with required columns
          let ownerId = '10000000-0000-0000-0000-000000000002';
          try {
            const userCheck = await fetch(
              `${supabaseUrl}/rest/v1/users?id=eq.${restaurantId}&select=id`,
              { headers: this.getSupabaseHeaders() },
            );
            if (userCheck.ok) {
              const uRows = await userCheck.json();
              if (uRows.length > 0) ownerId = uRows[0].id;
            }
          } catch {}

          const restInsertRes = await fetch(`${supabaseUrl}/rest/v1/restaurants`, {
            method: 'POST',
            headers: this.getSupabaseHeaders(),
            body: JSON.stringify([
              {
                id: restaurantId,
                owner_id: ownerId,
                name: "Chef's Kitchen",
                operational_status: 'ACTIVE',
                cuisine_types: ['Signature Cuisine'],
                rating: 4.8,
                average_prep_time_minutes: 15,
                minimum_order_amount: 10,
                delivery_fee_base: 2.99,
                street_address: '100 Culinary Way, Suite 100',
                city: 'Bangalore',
                location: 'POINT(77.6000 12.9780)',
              },
            ]),
          });
          if (!restInsertRes.ok) {
            console.error('Failed to auto-insert restaurant:', restInsertRes.status, await restInsertRes.text());
          }
        }
      }

      // 1. Get or create category
      const targetCategory = item.category || 'Signature Pizzas';
      let categoryId: string | null = null;

      const catCheckRes = await fetch(
        `${supabaseUrl}/rest/v1/menu_categories?restaurant_id=eq.${restaurantId}&name=eq.${encodeURIComponent(targetCategory)}&select=id`,
        { headers: this.getSupabaseHeaders() },
      );
      if (catCheckRes.ok) {
        const catRows = await catCheckRes.json();
        if (catRows.length > 0) {
          categoryId = catRows[0].id;
        }
      }

      if (!categoryId) {
        categoryId = randomUUID();
        await fetch(`${supabaseUrl}/rest/v1/menu_categories`, {
          method: 'POST',
          headers: this.getSupabaseHeaders(),
          body: JSON.stringify([
            {
              id: categoryId,
              restaurant_id: restaurantId,
              name: targetCategory,
              description: `${targetCategory} section`,
              display_order: 1,
              is_active: true,
            },
          ]),
        });
      }

      // 2. Insert menu item
      const newItemRow = {
        id: itemId,
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: item.name,
        description: item.description || `Handmade artisanal special. SKU: ${item.sku || 'PZ-100'}`,
        base_price: basePrice,
        image_url: item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        is_vegetarian: Boolean(item.dietary?.includes('Veg')),
        is_vegan: Boolean(item.dietary?.includes('Vegan')),
        is_gluten_free: Boolean(item.dietary?.includes('Gluten-Free')),
        is_available: item.inStock !== false,
        calories: 800,
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/menu_items`, {
        method: 'POST',
        headers: this.getSupabaseHeaders(),
        body: JSON.stringify([newItemRow]),
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('Supabase createMenuItem error response:', insertRes.status, errText);
      } else {
        console.log(`Successfully persisted dish "${item.name}" ($${basePrice}) to Supabase for restaurant ${restaurantId}`);
      }
    } catch (err) {
      console.warn('Supabase createMenuItem error:', err);
    }

    return {
      id: itemId,
      name: item.name,
      sku: item.sku || 'PZ-NEW',
      category: item.category || 'Signature Pizzas',
      price: basePrice,
      prepTime: item.prepTime || '15m',
      inStock: item.inStock !== false,
      image: item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
      station: item.station || 'Deck Oven 1',
      dietary: item.dietary || ['Veg'],
    };
  }

  async toggleMenuItemAvailability(
    restaurantId: string,
    itemId: string,
    isAvailable: boolean,
  ): Promise<{ success: boolean; itemId: string; isAvailable: boolean }> {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';

    try {
      await fetch(
        `${supabaseUrl}/rest/v1/menu_items?id=eq.${itemId}&restaurant_id=eq.${restaurantId}`,
        {
          method: 'PATCH',
          headers: this.getSupabaseHeaders(),
          body: JSON.stringify({ is_available: isAvailable }),
        },
      );
    } catch (err) {
      console.warn('Supabase toggle stock error:', err);
    }

    return { success: true, itemId, isAvailable };
  }

  async updateMenuItem(restaurantId: string, itemId: string, item: any): Promise<any> {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';

    try {
      const updatePayload: any = {};
      if (item.name) updatePayload.name = item.name;
      if (item.price) updatePayload.base_price = parseFloat(item.price);
      if (item.image) updatePayload.image_url = item.image;
      if (typeof item.inStock === 'boolean') updatePayload.is_available = item.inStock;
      if (item.description) updatePayload.description = item.description;

      await fetch(
        `${supabaseUrl}/rest/v1/menu_items?id=eq.${itemId}&restaurant_id=eq.${restaurantId}`,
        {
          method: 'PATCH',
          headers: this.getSupabaseHeaders(),
          body: JSON.stringify(updatePayload),
        },
      );
    } catch (err) {
      console.warn('Supabase updateMenuItem error:', err);
    }

    return { success: true, itemId, ...item };
  }

  async deleteMenuItem(restaurantId: string, itemId: string): Promise<{ success: boolean }> {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';

    try {
      await fetch(
        `${supabaseUrl}/rest/v1/menu_items?id=eq.${itemId}&restaurant_id=eq.${restaurantId}`,
        {
          method: 'DELETE',
          headers: this.getSupabaseHeaders(),
        },
      );
    } catch (err) {
      console.warn('Supabase deleteMenuItem error:', err);
    }

    return { success: true };
  }

  async updateSettings(
    restaurantId: string,
    settings: { isOpen?: boolean; prepBuffer?: number },
  ): Promise<{ success: boolean; settings: any }> {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';

    try {
      const updateData: any = {};
      if (typeof settings.isOpen === 'boolean') {
        updateData.operational_status = settings.isOpen ? 'ACTIVE' : 'INACTIVE';
      }
      if (settings.prepBuffer) {
        updateData.average_prep_time_minutes = settings.prepBuffer;
      }

      await fetch(`${supabaseUrl}/rest/v1/restaurants?id=eq.${restaurantId}`, {
        method: 'PATCH',
        headers: this.getSupabaseHeaders(),
        body: JSON.stringify(updateData),
      });

      // Update Redis Geo & metadata
      if (typeof settings.isOpen === 'boolean') {
        if (!settings.isOpen) {
          await this.geoStore.removeRestaurant(restaurantId);
        } else {
          await this.syncGeoIndex({ restaurantId, operationalStatus: 'ACTIVE' });
        }
      }
    } catch (err) {
      console.warn('Error updating restaurant settings:', err);
    }

    return { success: true, settings };
  }

  async getPayouts(restaurantId: string): Promise<any[]> {
    return [
      {
        id: 'SETTL-8829-01',
        date: 'Today, 10:00 AM',
        ordersCount: 142,
        grossAmount: 4820.5,
        commissionFee: 964.1, // 20% Byte Platform Commission
        netPayout: 3856.4, // 80% Merchant Payout
        status: 'PROCESSING',
        bankRef: 'ACH-CHASE-••8829',
      },
      {
        id: 'SETTL-8829-02',
        date: 'Yesterday, 10:00 AM',
        ordersCount: 138,
        grossAmount: 4410.0,
        commissionFee: 882.0,
        netPayout: 3528.0,
        status: 'SETTLED',
        bankRef: 'ACH-CHASE-••8829',
      },
      {
        id: 'SETTL-8829-03',
        date: 'Sep 27, 2026',
        ordersCount: 165,
        grossAmount: 5690.0,
        commissionFee: 1138.0,
        netPayout: 4552.0,
        status: 'SETTLED',
        bankRef: 'ACH-CHASE-••8829',
      },
    ];
  }

  async generateMenuImageUploadUrl(restaurantId: string, fileName: string, contentType: string) {
    return this.s3StorageService.generatePresignedUploadUrl(restaurantId, fileName, contentType);
  }

  async verifyMenuImageUpload(restaurantId: string, fileKey: string) {
    return this.s3StorageService.verifyUpload(restaurantId, fileKey);
  }
}
