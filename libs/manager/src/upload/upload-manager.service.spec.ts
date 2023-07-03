import { Test, TestingModule } from '@nestjs/testing';

import { UploadManagerService } from './upload-manager.service';

describe('UploadManagerService', () => {
  let service: UploadManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadManagerService],
    }).compile();

    service = module.get<UploadManagerService>(UploadManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
