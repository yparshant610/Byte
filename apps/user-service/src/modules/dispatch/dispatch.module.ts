import { Module } from '@nestjs/common';
import { DispatchController } from './controllers/dispatch.controller';
import { DriverController } from './controllers/driver.controller';
import { DispatchService } from './services/dispatch.service';

@Module({
  controllers: [DispatchController, DriverController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
