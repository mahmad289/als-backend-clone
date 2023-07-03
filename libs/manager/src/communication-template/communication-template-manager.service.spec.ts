import { Test, TestingModule } from '@nestjs/testing';

import { CommunicationTemplateManagerService } from './communication-template-manager.service';

describe('CommunicationTemplateManagerService', () => {
  let service: CommunicationTemplateManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunicationTemplateManagerService],
    }).compile();

    service = module.get<CommunicationTemplateManagerService>(
      CommunicationTemplateManagerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
