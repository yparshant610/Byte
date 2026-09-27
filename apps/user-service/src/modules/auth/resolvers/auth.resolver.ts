import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  AuthPayload,
  LoginInput,
  OtpResponse,
  RequestOtpInput,
  VerifyOtpSignupInput,
} from '../models/auth.models';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => OtpResponse)
  async requestOtp(@Args('input') input: RequestOtpInput): Promise<OtpResponse> {
    return this.authService.requestOtp(input);
  }

  @Mutation(() => AuthPayload)
  async verifyOtpAndSignup(@Args('input') input: VerifyOtpSignupInput): Promise<AuthPayload> {
    return this.authService.verifyOtpAndSignup(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }
}
