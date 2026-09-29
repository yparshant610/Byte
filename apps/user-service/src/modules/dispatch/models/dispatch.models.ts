import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DriverLocationDto {
  @ApiProperty({ example: 'd0000001-0000-0000-0000-000000000001' })
  @IsNotEmpty()
  @IsString()
  driverId: string;

  @ApiProperty({ example: 12.9750 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 77.6020 })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: 'ONLINE', enum: ['ONLINE', 'BUSY', 'OFFLINE'], required: false })
  @IsOptional()
  @IsIn(['ONLINE', 'BUSY', 'OFFLINE'])
  status?: 'ONLINE' | 'BUSY' | 'OFFLINE';
}

export class AssignOrderInputDto {
  @ApiProperty({ example: '30000000-0000-0000-0000-000000000001', required: false, description: 'If provided, coordinates are fetched via GEOPOS restaurants:geo in Redis' })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiProperty({ example: 12.9780, required: false })
  @IsOptional()
  @IsNumber()
  restaurantLat?: number;

  @ApiProperty({ example: 77.6000, required: false })
  @IsOptional()
  @IsNumber()
  restaurantLng?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  radiusKm?: number;
}

export class AssignOrderResponseDto {
  @ApiProperty({ example: 'ord_123456' })
  orderId: string;

  @ApiProperty({ example: 'd0000001-0000-0000-0000-000000000001' })
  assignedDriverId: string;

  @ApiProperty({ example: 0.42, description: 'Distance in km from driver to restaurant' })
  distanceKm: number;

  @ApiProperty({ example: 'ASSIGNED' })
  status: string;
}
