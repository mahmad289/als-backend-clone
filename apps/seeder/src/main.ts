import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { SeederModule } from './seeder.module';

dotenv.config({ path: '../.env' });

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  await app.listen(process.env.PORT || 8000);
}

bootstrap();
