import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
