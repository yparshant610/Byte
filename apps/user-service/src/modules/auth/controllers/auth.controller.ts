import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  AuthPayload,
  LoginInput,
  OtpResponse,
  RequestOtpInput,
  VerifyOtpSignupInput,
} from '../models/auth.models';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for consumer registration' })
  @ApiResponse({ status: 200, type: OtpResponse })
  async requestOtp(@Body() body: RequestOtpInput): Promise<OtpResponse> {
    return this.authService.requestOtp(body);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Verify OTP and complete consumer registration' })
  @ApiResponse({ status: 201, type: AuthPayload })
  async verifyOtpAndSignup(@Body() body: VerifyOtpSignupInput): Promise<AuthPayload> {
    return this.authService.verifyOtpAndSignup(body);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiResponse({ status: 200, type: AuthPayload })
  async login(@Body() body: LoginInput): Promise<AuthPayload> {
    return this.authService.login(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and blacklist JWT session in Redis' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async logout(@Req() req: any) {
    return this.authService.logout(req.token);
  }
}
