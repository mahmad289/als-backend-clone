import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initWinston } from 'als/building-block/utils/winstonLogger';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AlsReportingModule } from './als-reporting.module';

async function bootstrap() {
  const app = await NestFactory.create(AlsReportingModule);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('ALS-REPORTING')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.use(morgan('common'));
  initWinston('apps/als-reporting/logs');
  await app.listen(process.env.PORT || 3002);
}

bootstrap();
