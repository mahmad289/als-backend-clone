import { Test, TestingModule } from '@nestjs/testing';

import { BuildingBlockService } from './building-block.service';

describe('BuildingBlockService', () => {
  let service: BuildingBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildingBlockService],
    }).compile();

    service = module.get<BuildingBlockService>(BuildingBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
