import { Module } from '@nestjs/common';
import { DispatchController } from './controllers/dispatch.controller';
import { DispatchService } from './services/dispatch.service';

@Module({
  controllers: [DispatchController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
