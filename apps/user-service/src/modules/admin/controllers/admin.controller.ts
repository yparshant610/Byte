import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AdminDisputeModel,
  AdminDriverModel,
  AdminMerchantModel,
  FinancialStatsModel,
  ResolveDisputeDto,
  UpdateDriverStatusDto,
  UpdateMerchantCommissionDto,
  UpdateMerchantStatusDto,
} from '../models/admin.models';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin & Platform Governance')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- Merchants Governance ---
  @Get('merchants')
  @ApiOperation({ summary: 'Get all restaurant merchants for admin governance' })
  @ApiResponse({ status: 200 })
  async getMerchants(): Promise<AdminMerchantModel[]> {
    return this.adminService.getMerchants();
  }

  @Patch('merchants/:id/status')
  @ApiOperation({ summary: 'Approve or suspend a merchant partner in database and update Redis' })
  @ApiResponse({ status: 200 })
  async updateMerchantStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantStatusDto,
  ): Promise<AdminMerchantModel> {
    return this.adminService.updateMerchantStatus(id, dto);
  }

  @Patch('merchants/:id/commission')
  @ApiOperation({ summary: 'Update merchant commission take-rate in database' })
  @ApiResponse({ status: 200 })
  async updateMerchantCommission(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantCommissionDto,
  ): Promise<{ success: boolean; commissionRate: number }> {
    return this.adminService.updateMerchantCommission(id, dto);
  }

  // --- Driver Fleet Governance ---
  @Get('drivers')
  @ApiOperation({ summary: 'Get all fleet couriers for admin compliance audit' })
  @ApiResponse({ status: 200 })
  async getDrivers(): Promise<AdminDriverModel[]> {
    return this.adminService.getDrivers();
  }

  @Patch('drivers/:id/status')
  @ApiOperation({ summary: 'Update courier KYC audit or duty status in database' })
  @ApiResponse({ status: 200 })
  async updateDriverStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDriverStatusDto,
  ): Promise<{ success: boolean; driverId: string; status: string }> {
    return this.adminService.updateDriverStatus(id, dto);
  }

  // --- Dispute & Arbitration ---
  @Get('disputes')
  @ApiOperation({ summary: 'List customer, merchant, and driver dispute claims' })
  @ApiResponse({ status: 200 })
  async getDisputes(): Promise<AdminDisputeModel[]> {
    return this.adminService.getDisputes();
  }

  @Post('disputes/:id/resolve')
  @ApiOperation({ summary: 'Resolve dispute by issuing automated refund or rejecting claim' })
  @ApiResponse({ status: 200 })
  async resolveDispute(
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ): Promise<AdminDisputeModel> {
    return this.adminService.resolveDispute(id, dto);
  }

  // --- Financial & Multi-Split Governance ---
  @Get('financial-stats')
  @ApiOperation({ summary: 'Get real-time platform GMV, take-rates, and multi-split settlements' })
  @ApiResponse({ status: 200 })
  async getFinancialStats(): Promise<FinancialStatsModel> {
    return this.adminService.getFinancialStats();
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed or synchronize mock data into the database' })
  @ApiResponse({ status: 200 })
  async seedData(): Promise<{ success: boolean; message: string }> {
    await this.adminService.ensureDatabaseSeeded();
    return { success: true, message: 'Database mock data synchronized successfully.' };
  }
}
