import { AutoMap } from '@automapper/classes';
import { PickType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { GetDocumentsCompleteResponseDto } from './GetDocuments';

export class GetAllDocumentsResponseDto extends PickType(
  GetDocumentsCompleteResponseDto,
  ['_id', 'document_type_uuid'] as const,
) {
  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  count: number;
  @AutoMap()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  expiry_date: string;
}
