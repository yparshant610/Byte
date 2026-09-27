export type UserRole = 'CONSUMER' | 'DRIVER' | 'RESTAURANT_OWNER' | 'ADMIN';
export type RestaurantStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
export type DriverStatus = 'OFFLINE' | 'ONLINE' | 'BUSY' | 'SUSPENDED';

export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantEntity {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  cuisineTypes: string[];
  bannerUrl?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  streetAddress: string;
  city: string;
  latitude: number;
  longitude: number;
  operationalStatus: RestaurantStatus;
  rating: number;
  reviewCount: number;
  averagePrepTimeMinutes: number;
  minimumOrderAmount: number;
  deliveryFeeBase: number;
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemOptionEntity {
  id: string;
  optionGroupId: string;
  name: string;
  additionalPrice: number;
  isDefault: boolean;
}

export interface MenuItemOptionGroupEntity {
  id: string;
  menuItemId: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  options: MenuItemOptionEntity[];
}

export interface MenuItemEntity {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  calories?: number;
  optionGroups?: MenuItemOptionGroupEntity[];
}

export interface MenuCategoryEntity {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  items: MenuItemEntity[];
}

export interface OrderEntity {
  id: string;
  userId: string;
  restaurantId: string;
  driverId?: string;
  status: OrderStatus;
  deliveryAddressId?: string;
  destinationLatitude: number;
  destinationLongitude: number;
  deliveryNotes?: string;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  driverTip: number;
  platformCommissionAmount: number;
  restaurantPayoutAmount: number;
  driverPayoutAmount: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewEntity {
  id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  driverId?: string;
  foodRating: number;
  driverRating: number;
  foodReview?: string;
  driverReview?: string;
  complimentTags: string[];
  createdAt: Date;
}

export interface DriverEntity {
  id: string;
  userId: string;
  vehicleType: string;
  vehiclePlate: string;
  currentStatus: DriverStatus;
  latitude?: number;
  longitude?: number;
  rating: number;
  tripsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

export * from './seed';
