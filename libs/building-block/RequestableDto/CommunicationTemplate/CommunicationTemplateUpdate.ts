import { OmitType, PartialType } from '@nestjs/swagger';

import { CommunicationTemplateCreator } from './CommunicationTemplateCreator';

export class CommunicationTemplateUpdate extends PartialType(
  OmitType(CommunicationTemplateCreator, ['system_generated'] as const),
) {}
