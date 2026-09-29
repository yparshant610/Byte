import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriverLocationDto } from '../models/dispatch.models';
import { DispatchService } from '../services/dispatch.service';

@ApiTags('Fleet Dispatch & Telemetry')
@Controller('drivers')
export class DriverController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post('location')
  @ApiOperation({
    summary: 'Telemetry Ingestion: Driver GPS mobile ping',
    description: 'Driver mobile app sends GPS pings every 10–15s. Updates `drivers:available:geo` and sets heartbeat `driver:{driverId}:status`.',
  })
  @ApiResponse({ status: 200, schema: { type: 'object', properties: { success: { type: 'boolean' } } } })
  async updateLocation(@Body() body: DriverLocationDto) {
    return this.dispatchService.updateLocation(body);
  }
}
