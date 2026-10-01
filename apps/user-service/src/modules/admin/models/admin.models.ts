import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMerchantStatusDto {
  @ApiProperty({ enum: ['ACTIVE', 'PENDING', 'SUSPENDED'], example: 'ACTIVE' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ACTIVE', 'PENDING', 'SUSPENDED'])
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export class UpdateMerchantCommissionDto {
  @ApiProperty({ example: 20, description: 'Commission percentage (e.g. 15, 20)' })
  @IsNumber()
  @IsNotEmpty()
  commissionRate: number;
}

export class UpdateDriverStatusDto {
  @ApiProperty({ enum: ['VERIFIED', 'PENDING_AUDIT', 'SUSPENDED'], required: false })
  @IsOptional()
  @IsString()
  kycStatus?: 'VERIFIED' | 'PENDING_AUDIT' | 'SUSPENDED';

  @ApiProperty({ enum: ['ONLINE', 'BUSY', 'OFFLINE'], required: false })
  @IsOptional()
  @IsString()
  dutyStatus?: 'ONLINE' | 'BUSY' | 'OFFLINE';
}

export class ResolveDisputeDto {
  @ApiProperty({ enum: ['REFUND', 'REJECT'], example: 'REFUND' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['REFUND', 'REJECT'])
  action: 'REFUND' | 'REJECT';

  @ApiProperty({ required: false, example: 44.50 })
  @IsOptional()
  @IsNumber()
  refundAmount?: number;

  @ApiProperty({ required: false, example: 'Doorstep drop photo verified missing item' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export interface AdminMerchantModel {
  id: string;
  name: string;
  category: string;
  location: string;
  ownerName: string;
  rating: number;
  ordersCount30d: number;
  gmv30d: number;
  commissionRate: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedDate: string;
}

export interface AdminDriverModel {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'E-Bike' | 'Motorcycle' | 'Car';
  plate: string;
  rating: number;
  completedTrips: number;
  kycStatus: 'VERIFIED' | 'PENDING_AUDIT' | 'SUSPENDED';
  dutyStatus: 'ONLINE' | 'BUSY' | 'OFFLINE';
  zone: string;
}

export interface AdminDisputeModel {
  id: string;
  orderId: string;
  customerName: string;
  merchantName: string;
  courierName: string;
  claimAmount: number;
  reason: string;
  slaMinutesLeft: number;
  status: 'OPEN' | 'RESOLVED_REFUND' | 'RESOLVED_REJECTED';
  evidenceProof: string;
  createdAt: number;
}

export interface FinancialStatsModel {
  effectiveTakeRate: number;
  grossMerchantSales: number;
  netPlatformCommission: number;
  merchantRetainedRate: number;
  merchantRetainedAmount: number;
  activeMerchantsCount: number;
  registeredKitchensCount: number;
}
