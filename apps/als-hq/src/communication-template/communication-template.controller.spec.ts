import { Test, TestingModule } from '@nestjs/testing';

import { CommunicationTemplateController } from './communication-template.controller';

describe('CommunicationTemplateController', () => {
  let controller: CommunicationTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationTemplateController],
    }).compile();

    controller = module.get<CommunicationTemplateController>(
      CommunicationTemplateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
