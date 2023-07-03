import { Test, TestingModule } from '@nestjs/testing';

import { AutoNotificationService } from './auto-notification-manager.service';

describe('AutoNotificationService', () => {
  let service: AutoNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoNotificationService],
    }).compile();

    service = module.get<AutoNotificationService>(AutoNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
