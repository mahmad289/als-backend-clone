import { Test, TestingModule } from '@nestjs/testing';

import { AssignProjectManagerService } from './assign-project-manager.service';

describe('AssignProjectManagerService', () => {
  let service: AssignProjectManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignProjectManagerService],
    }).compile();

    service = module.get<AssignProjectManagerService>(
      AssignProjectManagerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
