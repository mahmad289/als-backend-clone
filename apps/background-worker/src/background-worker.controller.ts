import { Controller, Get } from '@nestjs/common';

import { BackgroundWorkerService } from './background-worker.service';

@Controller()
export class BackgroundWorkerController {
  constructor(
    private readonly backgroundWorkerService: BackgroundWorkerService,
  ) {}

  @Get('health-check')
  healthCheck() {
    return `Service is listening at port ${process.env.PORT}`;
  }
  @Get('ping')
  ping() {
    return `Background worker is listening`;
  }
}
