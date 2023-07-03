import { Module } from '@nestjs/common';
import { ManagerModule } from 'als/manager';

import { VendorController } from './vendor.controller';

@Module({
  imports: [ManagerModule],
  controllers: [VendorController],
})
export class VendorModule {}
