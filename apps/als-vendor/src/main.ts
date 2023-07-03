import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initWinston } from 'als/building-block/utils/winstonLogger';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AlsVendorModule } from './als-vendor.module';

async function bootstrap() {
  const app = await NestFactory.create(AlsVendorModule, {
    cors: true,
  });

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.use(morgan('common'));
  initWinston('apps/als-vendor/logs');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ALS-VENDOR')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT || 3003);
}

bootstrap();
