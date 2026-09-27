export interface JwtPayload {
  sub: string;         // User UUID
  email: string;       // User Email
  role: 'CONSUMER' | 'DRIVER' | 'RESTAURANT_OWNER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.trim().split(' ');
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1];
  }
  return null;
}
