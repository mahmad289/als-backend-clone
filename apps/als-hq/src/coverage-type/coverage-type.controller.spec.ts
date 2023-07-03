import { Test, TestingModule } from '@nestjs/testing';

import { CoverageTypeController } from './coverage-type.controller';

describe('CoverageTypeController', () => {
  let controller: CoverageTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoverageTypeController],
    }).compile();

    controller = module.get<CoverageTypeController>(CoverageTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
