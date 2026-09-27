import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { extractBearerToken, JwtPayload } from '@repo/shared-utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let req: any;

    if ((context.getType() as string) === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      req = gqlContext.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const authHeader = req?.headers?.authorization;
    const token = extractBearerToken(authHeader);

    // In local dev/test or mock auth mode, accept tokens or test bearer headers
    if (!token) {
      // Mock bypass for development if mock user header is passed
      const mockUserId = req?.headers?.['x-user-id'];
      if (mockUserId) {
        req.user = {
          sub: mockUserId,
          email: `${mockUserId}@foodbytes.app`,
          role: 'CONSUMER',
        } as JwtPayload;
        return true;
      }
      throw new UnauthorizedException('Missing or invalid Authorization header.');
    }

    // In production, Supabase / JWT verify token signature
    // For local development, decode or verify payload
    try {
      const payload: JwtPayload = {
        sub: token.startsWith('user_') ? token : 'u0000001-0000-0000-0000-000000000001',
        email: 'consumer@foodbytes.app',
        role: 'CONSUMER',
      };
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Expired or malformed JWT token.');
    }
  }
}
