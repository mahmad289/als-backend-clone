import { Controller, Get } from '@nestjs/common';

import { AlsVendorService } from './als-vendor.service';

@Controller()
export class AlsVendorController {
  constructor(private readonly alsVendorService: AlsVendorService) {}

  @Get('health-check')
  healthCheck() {
    return `Service is listening at port ${process.env.PORT}`;
  }
  @Get('ping')
  ping() {
    return `ALS Vendor is listening`;
  }
}
