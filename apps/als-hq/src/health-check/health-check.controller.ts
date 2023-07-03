import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('ALS-HQ health-check')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongo: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  httpcheck() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          `ALS Head Quater - ${new Date()
            .toString()
            .replace(/T/, ':')
            .replace(/\.\w*/, '')}`,
          `${process.env.FRONTEND_URL}`,
        ),
    ]);
  }
}
