import { io, Socket } from 'socket.io-client';

// ==========================================
// 1. DESIGN TOKENS (LIGHT & DARK SYSTEMS)
// ==========================================
export const DESIGN_TOKENS = {
  light: {
    name: 'Food Bites System',
    primary: '#bb0021',
    primaryContainer: '#ea002c',
    onPrimary: '#ffffff',
    background: '#fcf9f8',
    surface: '#fcf9f8',
    surfaceContainer: '#f0edec',
    surfaceContainerLow: '#f6f3f2',
    surfaceContainerLowest: '#ffffff',
    onSurface: '#1c1b1b',
    onSurfaceVariant: '#5e3f3d',
    outline: '#936e6c',
    secondary: '#895100',
    secondaryContainer: '#fd9d1a',
    tertiary: '#00685f',
    goldAccent: '#ffb86b',
    radiusDefault: '1rem',
    radiusLg: '2rem',
    radiusFull: '9999px',
  },
  dark: {
    name: 'Midnight Gastronomy',
    primary: '#ff1e38',
    primaryContainer: '#ff5356',
    onPrimary: '#ffffff',
    background: '#131315',
    surface: '#131315',
    surfaceContainer: '#201f21',
    surfaceContainerLow: '#1b1b1d',
    surfaceContainerLowest: '#0e0e10',
    onSurface: '#fcf9f8',
    onSurfaceVariant: '#a0a0a5',
    outline: '#454448',
    secondary: '#ffb4ab',
    secondaryContainer: '#931011',
    tertiary: '#ffb77a',
    goldAccent: '#ffb77a',
    radiusDefault: '1rem',
    radiusLg: '2rem',
    radiusFull: '9999px',
  },
};

// ==========================================
// 2. TYPES & INTERFACES
// ==========================================
export type Role = 'CONSUMER' | 'DRIVER' | 'RESTAURANT_OWNER' | 'ADMIN';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  phone?: string;
}

export interface MenuItemOption {
  groupName: string;
  choiceName: string;
  additionalPrice: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  category: string;
  isVegetarian?: boolean;
  isPopular?: boolean;
  optionGroups?: {
    name: string;
    required: boolean;
    choices: { name: string; additionalPrice: number }[];
  }[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  averagePrepTimeMinutes: number;
  bannerUrl: string;
  distanceKm?: number;
  location: {
    lat: number;
    lng: number;
  };
  deliveryFee: number;
  minimumOrder: number;
  address?: string;
  isOpen?: boolean;
}

export interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  unitPrice: number;
  itemTotal: number;
  selectedOptions?: MenuItemOption[];
}

export interface Cart {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: number;
}

export interface OrderSplitBreakdown {
  platformCommission: number;
  restaurantPayout: number;
  driverPayout: number;
  vendorDriverTotalPayout: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName?: string;
  driverId?: string;
  status: OrderStatus;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options?: MenuItemOption[];
  }[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  driverTip: number;
  totalAmount: number;
  split: OrderSplitBreakdown;
  deliveryAddress?: string;
  deliveryNotes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  orderId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'DRIVER';
  message: string;
  timestamp: number;
}

export interface DriverTelemetry {
  orderId: string;
  driverId: string;
  lat: number;
  lng: number;
  bearing?: number;
  speed?: number;
  timestamp: number;
}

// ==========================================
// 3. API CLIENT SERVICE
// ==========================================
export class FoodByteApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private role: Role = 'CONSUMER';
  private userId: string | null = null;

  constructor(baseUrl = 'http://localhost:4000/api/v1') {
    this.baseUrl = baseUrl;
    // Hydrate token from localStorage if in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('fb_access_token');
      this.userId = localStorage.getItem('fb_user_id');
      this.role = (localStorage.getItem('fb_user_role') as Role) || 'CONSUMER';
    }
  }

  setAuth(token: string, userId: string, role: Role = 'CONSUMER') {
    this.token = token;
    this.userId = userId;
    this.role = role;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fb_access_token', token);
      localStorage.setItem('fb_user_id', userId);
      localStorage.setItem('fb_user_role', role);
    }
  }

  clearAuth() {
    this.token = null;
    this.userId = null;
    this.role = 'CONSUMER';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fb_access_token');
      localStorage.removeItem('fb_user_id');
      localStorage.removeItem('fb_user_role');
    }
  }

  getUserId() {
    return this.userId;
  }

  getUserRole() {
    return this.role;
  }

  isAuthenticated() {
    return !!this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }
    if (this.role) {
      headers['x-user-role'] = this.role;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : (null as any);
  }

  // --- Auth APIs ---
  async signup(email: string, role: Role = 'CONSUMER'): Promise<{ message: string; otpId?: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async verifyOtp(email: string, otp: string): Promise<{ accessToken: string; user: User }> {
    const res = await this.request<{ accessToken: string; user: User }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    if (res?.accessToken && res?.user) {
      this.setAuth(res.accessToken, res.user.id, res.user.role);
    }
    return res;
  }

  async signin(email: string, role: Role = 'CONSUMER'): Promise<{ accessToken: string; user: User }> {
    const res = await this.request<{ accessToken: string; user: User }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
    if (res?.accessToken && res?.user) {
      this.setAuth(res.accessToken, res.user.id, res.user.role);
    }
    return res;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearAuth();
    }
  }

  // --- Restaurants APIs ---
  async getNearbyRestaurants(lat = 12.9716, lng = 77.5946, radiusKm = 10): Promise<{ restaurant: Restaurant; distanceKm: number }[]> {
    return this.request(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    return this.request(`/restaurants/${id}`);
  }

  // --- Cart APIs ---
  async getCart(): Promise<Cart | null> {
    return this.request('/cart');
  }

  async addItemToCart(item: {
    restaurantId: string;
    restaurantName: string;
    itemId: string;
    name: string;
    quantity: number;
    basePrice: number;
    selectedOptions?: MenuItemOption[];
    clearExisting?: boolean;
  }): Promise<Cart> {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(itemId: string, quantity: number, options?: MenuItemOption[]): Promise<Cart> {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, selectedOptions: options }),
    });
  }

  async removeItemFromCart(itemId: string): Promise<Cart | null> {
    return this.request(`/cart/items/${itemId}`, { method: 'DELETE' });
  }

  async clearCart(): Promise<boolean> {
    return this.request('/cart', { method: 'DELETE' });
  }

  // --- Order & Lifecycle APIs ---
  async checkout(input: {
    deliveryAddress: string;
    destinationLat: number;
    destinationLng: number;
    deliveryNotes?: string;
    driverTip?: number;
  }): Promise<{ order: Order; razorpayOrderId: string; keyId: string }> {
    return this.request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order> {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  }

  async addTip(orderId: string, tipAmount: number): Promise<Order> {
    return this.request(`/orders/${orderId}/tip`, {
      method: 'POST',
      body: JSON.stringify({ tipAmount }),
    });
  }

  async submitReview(
    orderId: string,
    review: {
      foodRating?: number;
      driverRating?: number;
      foodReview?: string;
      driverReview?: string;
      complimentTags?: string[];
    },
  ): Promise<{ success: boolean; reviewId: string; message: string }> {
    return this.request(`/orders/${orderId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async refundOrder(orderId: string, reason: string, amount?: number): Promise<{ success: boolean; refundedAmount: number }> {
    return this.request(`/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason, amount }),
    });
  }

  // --- Driver & Fleet APIs ---
  async updateDriverLocation(payload: {
    driverId: string;
    lat: number;
    lng: number;
    status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  }): Promise<{ status: string }> {
    return this.request('/drivers/location', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

// Global default client instance
export const apiClient = new FoodByteApiClient();

// ==========================================
// 4. WEBSOCKET HELPER
// ==========================================
export function createOrderSocket(wsUrl = 'http://localhost:4000'): Socket {
  return io(wsUrl, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });
}
