import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { InstallerModule } from './installer.module';

dotenv.config({ path: '../.env' });

async function bootstrap() {
  const app = await NestFactory.create(InstallerModule);
  await app.listen(process.env.PORT || 8000);
}

bootstrap();
