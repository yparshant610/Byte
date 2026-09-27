import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AssignOrderInputDto,
  AssignOrderResponseDto,
  DriverLocationDto,
} from '../models/dispatch.models';
import { DispatchService } from '../services/dispatch.service';

@ApiTags('Fleet Dispatch & Telemetry')
@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post('drivers/location')
  @ApiOperation({ summary: 'Update driver real-time GPS location in Redis Geospatial index' })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { success: { type: 'boolean' } } } })
  async updateLocation(@Body() body: DriverLocationDto) {
    return this.dispatchService.updateLocation(body);
  }

  @Post('assign-order/:orderId')
  @ApiOperation({
    summary: 'Find and atomically claim nearest available driver to restaurant via Redis',
    description: 'Searches `drivers:available:geo` within 5 km of restaurant and executes an atomic lock reservation.',
  })
  @ApiResponse({ status: 200, type: AssignOrderResponseDto })
  async assignDriver(
    @Param('orderId') orderId: string,
    @Body() body: AssignOrderInputDto,
  ): Promise<AssignOrderResponseDto> {
    return this.dispatchService.assignDriver(orderId, body);
  }
}
