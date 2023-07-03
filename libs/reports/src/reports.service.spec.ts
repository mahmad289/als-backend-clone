import { Test, TestingModule } from '@nestjs/testing';

import { ReportManagerService } from './report-manager.service';

describe('ReportsService', () => {
  let service: ReportManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportManagerService],
    }).compile();

    service = module.get<ReportManagerService>(ReportManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
