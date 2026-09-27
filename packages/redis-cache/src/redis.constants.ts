export const REDIS_KEYS = {
  CART_PREFIX: 'cart:',
  RESTAURANTS_GEO: 'restaurants:geo',
  RESTAURANT_META_PREFIX: 'restaurant:',
  DRIVERS_AVAILABLE_GEO: 'drivers:available:geo',
  DRIVER_STATUS_PREFIX: 'driver:',
  RATE_LIMIT_PREFIX: 'ratelimit:',
  TOKEN_BLACKLIST_PREFIX: 'token:blacklist:',
  ORDER_DISPATCH_LOCK: 'lock:order:dispatch:',
};

export const CART_TTL_SECONDS = 86400; // 24 hours sliding expiration
export const DRIVER_HEARTBEAT_TTL_SECONDS = 30; // 30 seconds
export const RESTAURANT_MAX_DISCOVERY_RADIUS_KM = 10; // Constant 10 km requirement
