import { Controller, Get } from '@nestjs/common';

import { AlsReportingService } from './als-reporting.service';

@Controller()
export class AlsReportingController {
  constructor(private readonly alsReportingService: AlsReportingService) {}

  @Get('health-check')
  healthCheck() {
    return `ALS Reporting server is listening at port ${process.env.PORT}`;
  }
  @Get('ping')
  ping() {
    return `ALS Reporting is listening`;
  }
}
