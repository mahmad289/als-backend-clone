import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';

import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
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
