import { Test, TestingModule } from '@nestjs/testing';

import { AuthManagerService } from './auth-manager.service';

describe('AuthManagerService', () => {
  let service: AuthManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthManagerService],
    }).compile();

    service = module.get<AuthManagerService>(AuthManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
