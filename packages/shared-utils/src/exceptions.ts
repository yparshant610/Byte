export class BusinessException extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly code: string = 'BUSINESS_ERROR',
  ) {
    super(message);
    this.name = 'BusinessException';
  }
}

export class SingleRestaurantViolationException extends BusinessException {
  constructor(existingRestaurantId: string, attemptedRestaurantId: string) {
    super(
      `Cart already contains items from restaurant '${existingRestaurantId}'. Clear cart first before adding from '${attemptedRestaurantId}'.`,
      409,
      'SINGLE_RESTAURANT_VIOLATION',
    );
    this.name = 'SingleRestaurantViolationException';
  }
}

export class RateLimitExceededException extends BusinessException {
  constructor(retryAfterSeconds: number) {
    super(
      `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
      429,
      'RATE_LIMIT_EXCEEDED',
    );
    this.name = 'RateLimitExceededException';
  }
}

export class DriverUnavailableException extends BusinessException {
  constructor(orderId: string, searchRadiusKm: number) {
    super(
      `No available delivery partners found within ${searchRadiusKm} km of restaurant for order '${orderId}'.`,
      404,
      'DRIVER_UNAVAILABLE',
    );
    this.name = 'DriverUnavailableException';
  }
}
