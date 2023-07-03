import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'als/building-block/decorators/IsPublic';

@Controller()
export class AppController {
  @IsPublic()
  @Get('health-check')
  healthCheck() {
    return `Service is listening at port ${process.env.PORT}`;
  }
  @IsPublic()
  @Get('ping')
  ping() {
    return `HQ server is listening`;
  }
}
