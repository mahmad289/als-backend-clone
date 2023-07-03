import {
  BullMQAdapter,
  createBullBoard,
  ExpressAdapter,
} from '@bull-board/express';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  AUTO_NOTIFICATION_QUEUE,
  COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE,
  COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
  MAILER_QUEUE,
  NAME_UPDATE_QUEUE,
  PROJECT_ASSIGNEE_QUEUE,
  TEMPLATE_UPDATE_QUEUE,
  VENDOR_COMPLIANCE_QUEUE,
} from 'als/building-block/constants';
import { initWinston } from 'als/building-block/utils/winstonLogger';
import { Queue } from 'bullmq';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { BackgroundWorkerModule } from './background-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(BackgroundWorkerModule);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const vendorComplainceQueue = new Queue(VENDOR_COMPLIANCE_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  const projectAssignQueue = new Queue(PROJECT_ASSIGNEE_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  const mailQueue = new Queue(MAILER_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  const CURRCQueue = new Queue(COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  const CURTCQueue = new Queue(
    COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE,
    {
      connection: { host: 'redis', port: 6379 },
    },
  );

  const TempUpdateQueue = new Queue(TEMPLATE_UPDATE_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  const AutoNotificationQueue = new Queue(AUTO_NOTIFICATION_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  const NameUpdateQueue = new Queue(NAME_UPDATE_QUEUE, {
    connection: { host: 'redis', port: 6379 },
  });

  // adapter
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/api/v1/admin/queues');
  const option = { uiConfig: { boardTitle: 'Als Redis' } };
  createBullBoard({
    queues: [
      new BullMQAdapter(vendorComplainceQueue),
      new BullMQAdapter(projectAssignQueue),
      new BullMQAdapter(mailQueue),
      new BullMQAdapter(CURRCQueue),
      new BullMQAdapter(CURTCQueue),
      new BullMQAdapter(TempUpdateQueue),
      new BullMQAdapter(AutoNotificationQueue),
      new BullMQAdapter(NameUpdateQueue),
    ],
    serverAdapter: serverAdapter,
    options: option,
  });
  app.use('/api/v1/admin/queues', serverAdapter.getRouter());
  app.use(morgan('common'));
  initWinston('apps/background-worker/logs');
  await app.listen(process.env.PORT || 3004, () => {
    Logger.log('For the UI, open http://localhost:3004/api/v1/admin/queues');
  });
}

bootstrap();
