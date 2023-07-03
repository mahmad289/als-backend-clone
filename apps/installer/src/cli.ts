import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';

import { InstallerModule } from './installer.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(InstallerModule, {
    logger: ['error', 'warn', 'log'], // only errors
  });

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    Logger.log(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
