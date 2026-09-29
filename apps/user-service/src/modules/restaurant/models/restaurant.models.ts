import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class LocationType {
  @Field(() => Float)
  @ApiProperty({ example: 12.9780 })
  lat: number;

  @Field(() => Float)
  @ApiProperty({ example: 77.6000 })
  lng: number;

  @Field({ nullable: true })
  @ApiProperty({ example: '42 Wood Street, Bangalore', required: false })
  address?: string;
}

@ObjectType()
export class RestaurantType {
  @Field(() => ID)
  @ApiProperty({ example: 'r0000001-0000-0000-0000-000000000001' })
  id: string;

  @Field()
  @ApiProperty({ example: "Tony's Artisan Pizza" })
  name: string;

  @Field(() => [String])
  @ApiProperty({ example: ['Italian', 'Pizza'] })
  cuisine: string[];

  @Field(() => Float)
  @ApiProperty({ example: 4.8 })
  rating: number;

  @Field(() => Int)
  @ApiProperty({ example: 25 })
  prepTimeMinutes: number;

  @Field()
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' })
  bannerUrl: string;

  @Field()
  @ApiProperty({ example: true })
  isOpen: boolean;

  @Field(() => Float)
  @ApiProperty({ example: 15.0 })
  minimumOrder: number;

  @Field(() => Float)
  @ApiProperty({ example: 2.99 })
  deliveryFee: number;

  @Field(() => LocationType)
  @ApiProperty({ type: LocationType })
  location: LocationType;
}

@ObjectType()
export class NearbyRestaurantType {
  @Field(() => RestaurantType)
  @ApiProperty({ type: RestaurantType })
  restaurant: RestaurantType;

  @Field(() => Float)
  @ApiProperty({ example: 0.92, description: 'Distance in kilometers from user' })
  distanceKm: number;
}

export class GeoIndexRestaurantInput {
  @ApiProperty({ example: '30000000-0000-0000-0000-000000000001' })
  restaurantId: string;

  @ApiProperty({ example: "Tony's Artisan Pizza", required: false })
  name?: string;

  @ApiProperty({ example: ['Italian', 'Pizza'], required: false })
  cuisine?: string[];

  @ApiProperty({ example: 4.8, required: false })
  rating?: number;

  @ApiProperty({ example: 20, required: false })
  prepTimeMinutes?: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1513104890138-7c749659a591', required: false })
  bannerUrl?: string;

  @ApiProperty({ example: 12.9780, required: false })
  lat?: number;

  @ApiProperty({ example: 77.6000, required: false })
  lng?: number;

  @ApiProperty({ example: '42 Wood Street, Bangalore', required: false })
  address?: string;

  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL'], required: false })
  operationalStatus?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
}
