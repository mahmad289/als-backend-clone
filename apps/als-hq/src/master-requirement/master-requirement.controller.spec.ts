import { Test, TestingModule } from '@nestjs/testing';

import { MasterRequirementController } from './master-requirement.controller';

describe('MasterRequirementController', () => {
  let controller: MasterRequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterRequirementController],
    }).compile();

    controller = module.get<MasterRequirementController>(
      MasterRequirementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
