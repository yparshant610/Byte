import { SingleRestaurantViolationException } from '@repo/shared-utils';
import { CART_TTL_SECONDS, REDIS_KEYS } from './redis.constants';
import { RedisClientWrapper } from './redis.client';

export interface CartSelectedOption {
  groupName: string;
  choiceName: string;
  additionalPrice: number;
}

export interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  selectedOptions: CartSelectedOption[];
  unitPrice: number;
  itemTotal: number;
}

export interface CartData {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: number;
}

export interface AddItemInput {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  itemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  selectedOptions?: CartSelectedOption[];
  clearExisting?: boolean;
}

export class RedisCartStore {
  constructor(private readonly redisWrapper: RedisClientWrapper) {}

  private getCartKey(userId: string): string {
    return `${REDIS_KEYS.CART_PREFIX}${userId}`;
  }

  async getCart(userId: string): Promise<CartData | null> {
    const client = this.redisWrapper.getClient();
    const key = this.getCartKey(userId);
    const raw = await client.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CartData;
    } catch {
      return null;
    }
  }

  async addItem(input: AddItemInput): Promise<CartData> {
    const client = this.redisWrapper.getClient();
    const key = this.getCartKey(input.userId);
    let cart = await this.getCart(input.userId);

    // Single-restaurant constraint check
    if (cart && cart.items.length > 0 && cart.restaurantId !== input.restaurantId) {
      if (!input.clearExisting) {
        throw new SingleRestaurantViolationException(cart.restaurantId, input.restaurantId);
      }
      // User opted to clear existing restaurant's cart
      cart = null;
    }

    if (!cart) {
      cart = {
        userId: input.userId,
        restaurantId: input.restaurantId,
        restaurantName: input.restaurantName,
        items: [],
        subtotal: 0,
        itemCount: 0,
        updatedAt: Date.now(),
      };
    }

    const options = input.selectedOptions || [];
    const optionsTotal = options.reduce((sum, opt) => sum + opt.additionalPrice, 0);
    const unitPrice = input.basePrice + optionsTotal;

    // Check if identical item with identical options already exists
    const existingIndex = cart.items.findIndex(
      it => it.itemId === input.itemId && JSON.stringify(it.selectedOptions) === JSON.stringify(options),
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += input.quantity;
      cart.items[existingIndex].itemTotal = parseFloat(
        (cart.items[existingIndex].quantity * cart.items[existingIndex].unitPrice).toFixed(2),
      );
    } else {
      cart.items.push({
        itemId: input.itemId,
        name: input.name,
        quantity: input.quantity,
        basePrice: input.basePrice,
        selectedOptions: options,
        unitPrice: parseFloat(unitPrice.toFixed(2)),
        itemTotal: parseFloat((unitPrice * input.quantity).toFixed(2)),
      });
    }

    this.recalculateCart(cart);

    await client.set(key, JSON.stringify(cart), 'EX', CART_TTL_SECONDS);
    return cart;
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<CartData | null> {
    const client = this.redisWrapper.getClient();
    const key = this.getCartKey(userId);
    const cart = await this.getCart(userId);
    if (!cart) return null;

    if (quantity <= 0) {
      cart.items = cart.items.filter(it => it.itemId !== itemId);
    } else {
      const item = cart.items.find(it => it.itemId === itemId);
      if (item) {
        item.quantity = quantity;
        item.itemTotal = parseFloat((item.unitPrice * quantity).toFixed(2));
      }
    }

    if (cart.items.length === 0) {
      await this.clearCart(userId);
      return null;
    }

    this.recalculateCart(cart);
    await client.set(key, JSON.stringify(cart), 'EX', CART_TTL_SECONDS);
    return cart;
  }

  async removeItem(userId: string, itemId: string): Promise<CartData | null> {
    return this.updateItemQuantity(userId, itemId, 0);
  }

  async clearCart(userId: string): Promise<boolean> {
    const client = this.redisWrapper.getClient();
    const key = this.getCartKey(userId);
    const count = await client.del(key);
    return count > 0;
  }

  private recalculateCart(cart: CartData): void {
    let subtotal = 0;
    let count = 0;
    for (const item of cart.items) {
      subtotal += item.itemTotal;
      count += item.quantity;
    }
    cart.subtotal = parseFloat(subtotal.toFixed(2));
    cart.itemCount = count;
    cart.updatedAt = Date.now();
  }
}
