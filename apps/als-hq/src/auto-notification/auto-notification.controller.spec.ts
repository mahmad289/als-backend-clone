import { Test, TestingModule } from '@nestjs/testing';

import { AutoNotificationController } from './auto-notification.controller';

describe('AutoNotificationController', () => {
  let controller: AutoNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoNotificationController],
    }).compile();

    controller = module.get<AutoNotificationController>(
      AutoNotificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
