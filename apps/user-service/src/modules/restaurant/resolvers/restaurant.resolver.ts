import { Args, Float, ID, Query, Resolver } from '@nestjs/graphql';
import { NearbyRestaurantType, RestaurantType } from '../models/restaurant.models';
import { RestaurantService } from '../services/restaurant.service';

@Resolver()
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => [NearbyRestaurantType])
  async nearbyRestaurants(
    @Args('lat', { type: () => Float }) lat: number,
    @Args('lng', { type: () => Float }) lng: number,
    @Args('radiusKm', { type: () => Float, defaultValue: 10 }) radiusKm: number,
  ): Promise<NearbyRestaurantType[]> {
    return this.restaurantService.findNearby(lat, lng, radiusKm);
  }

  @Query(() => RestaurantType, { nullable: true })
  async restaurantDetails(@Args('id', { type: () => ID }) id: string): Promise<RestaurantType | null> {
    return this.restaurantService.getById(id);
  }
}
