import { Test, TestingModule } from '@nestjs/testing';

import { AlsUserManagerService } from './user-manager.service';

describe('AlsUserManagerService', () => {
  let service: AlsUserManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlsUserManagerService],
    }).compile();

    service = module.get<AlsUserManagerService>(AlsUserManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
