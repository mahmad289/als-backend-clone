import { OmitType, PartialType } from '@nestjs/swagger';

import { DocumentUploadCreator } from './DocumentUploadCreator';

export class DocumentUploadUpdate extends PartialType(
  OmitType(DocumentUploadCreator, [
    'item_id',
    'compliance_id',
    'item_type',
    'contact_id',
  ] as const),
) {}
