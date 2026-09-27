import { Controller, Get, Param, ParseFloatPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NearbyRestaurantType, RestaurantType } from '../models/restaurant.models';
import { RestaurantService } from '../services/restaurant.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('nearby')
  @ApiOperation({
    summary: 'Discover nearby restaurants within 10 km radius using Redis Geospatial',
    description: 'Executes sub-millisecond GEOSEARCH on Redis and returns restaurants sorted by ascending distance.',
  })
  @ApiQuery({ name: 'lat', required: true, example: 12.9716 })
  @ApiQuery({ name: 'lng', required: true, example: 77.5946 })
  @ApiQuery({ name: 'radiusKm', required: false, example: 10 })
  @ApiResponse({ status: 200, type: [NearbyRestaurantType] })
  async findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radiusKm') radiusKm?: string,
  ): Promise<NearbyRestaurantType[]> {
    const radius = radiusKm ? parseFloat(radiusKm) : 10;
    return this.restaurantService.findNearby(lat, lng, radius);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant details by ID' })
  @ApiResponse({ status: 200, type: RestaurantType })
  async getDetails(@Param('id') id: string): Promise<RestaurantType | null> {
    return this.restaurantService.getById(id);
  }
}
