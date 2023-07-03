import { Test, TestingModule } from '@nestjs/testing';

import { VendorManagerService } from './vendor-manager.service';

describe('VendorManagerService', () => {
  let service: VendorManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorManagerService],
    }).compile();

    service = module.get<VendorManagerService>(VendorManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
