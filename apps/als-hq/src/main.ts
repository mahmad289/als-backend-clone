import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initWinston } from 'als/building-block/utils/winstonLogger';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const ocrResponseQueue = configService.get('RABBITMQ_QUEUE_OCR_CONSUMER');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: ocrResponseQueue,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();

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
    .setTitle('ALS')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.use(morgan('common'));
  initWinston('apps/als-hq/logs');
  await app.listen(process.env.PORT || 3001);
}

bootstrap();
