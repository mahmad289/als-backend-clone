import { Test, TestingModule } from '@nestjs/testing';

import { ContactManagerService } from './contact-manager.service';

describe('ContactManagerService', () => {
  let service: ContactManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactManagerService],
    }).compile();

    service = module.get<ContactManagerService>(ContactManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
