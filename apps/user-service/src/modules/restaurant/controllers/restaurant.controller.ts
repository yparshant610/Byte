import { Body, Controller, Delete, Get, Param, ParseFloatPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeoIndexRestaurantInput, NearbyRestaurantType, RestaurantType } from '../models/restaurant.models';
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

  @Get(':id/menu')
  @ApiOperation({ summary: 'Get complete menu and categories for restaurant' })
  async getMenu(@Param('id') id: string) {
    return this.restaurantService.getRestaurantMenu(id);
  }

  @Post(':id/menu/upload-url')
  @ApiOperation({ summary: 'Step 1: Generate S3 presigned PUT URL for dish image upload' })
  async getUploadUrl(
    @Param('id') id: string,
    @Body() body: { fileName: string; contentType: string },
  ) {
    return this.restaurantService.generateMenuImageUploadUrl(id, body.fileName, body.contentType);
  }

  @Post(':id/menu/verify-upload')
  @ApiOperation({ summary: 'Step 2: Verify dish image upload on S3 bucket' })
  async verifyUpload(
    @Param('id') id: string,
    @Body() body: { fileKey: string },
  ) {
    return this.restaurantService.verifyMenuImageUpload(id, body.fileKey);
  }

  @Post(':id/menu/items')
  @ApiOperation({ summary: 'Create new dish/item for restaurant' })
  async createMenuItem(@Param('id') id: string, @Body() body: any) {
    return this.restaurantService.createMenuItem(id, body);
  }

  @Patch(':id/menu/items/:itemId/availability')
  @ApiOperation({ summary: 'Toggle 86 stock status for menu item' })
  async toggleStock(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.restaurantService.toggleMenuItemAvailability(id, itemId, isAvailable);
  }

  @Patch(':id/menu/items/:itemId')
  @ApiOperation({ summary: 'Update dish metadata' })
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: any,
  ) {
    return this.restaurantService.updateMenuItem(id, itemId, body);
  }

  @Delete(':id/menu/items/:itemId')
  @ApiOperation({ summary: 'Remove dish from menu' })
  async deleteItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.restaurantService.deleteMenuItem(id, itemId);
  }

  @Patch(':id/settings')
  @ApiOperation({ summary: 'Update operational status & prep time buffer' })
  async updateSettings(@Param('id') id: string, @Body() body: any) {
    return this.restaurantService.updateSettings(id, body);
  }

  @Get(':id/payouts')
  @ApiOperation({ summary: 'Get 80/20 platform settlements for restaurant' })
  async getPayouts(@Param('id') id: string) {
    return this.restaurantService.getPayouts(id);
  }

  @Post('geo-index')
  @ApiOperation({
    summary: 'Admin/Merchant Sync: Index or invalidate restaurant in Redis Geospatial engine',
    description: 'Automatically updates or invalidates coordinates in `restaurants:geo` when operational status or location changes.',
  })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { success: { type: 'boolean' }, action: { type: 'string' } } } })
  async syncGeoIndex(@Body() body: GeoIndexRestaurantInput) {
    return this.restaurantService.syncGeoIndex(body);
  }
}
