import { OmitType, PartialType } from '@nestjs/swagger';

import { EscalationCreator } from './EscalationCreator';

export class EscalationUpdate extends PartialType(
  OmitType(EscalationCreator, [
    'compliance_id',
    'project_id',
    'client_id',
    'user_id',
  ]),
) {}
