import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ManagerModule } from 'als/manager';
import { NotificationGateway } from 'apps/als-hq/notification/notification.gateway';

import { OcrController } from './ocr.controller';

@Module({
  imports: [
    ManagerModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/als-hq/.env',
    }),
  ],
  controllers: [OcrController],
  providers: [
    NotificationGateway,
    {
      provide: 'OCR_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const ocrProducer = configService.get('RABBITMQ_QUEUE_OCR_PRODUCER');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: ocrProducer,
            noAck: false,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class OcrModule {}
