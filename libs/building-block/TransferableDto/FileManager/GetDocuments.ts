import { AutoMap } from '@automapper/classes';
import { OmitType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

import { DocumentUploadCompleteResponseDto } from '../DocumentUpload/DocumentUpload';

export class GetDocumentsCompleteResponseDto extends OmitType(
  DocumentUploadCompleteResponseDto,
  ['compliance'] as const,
) {
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  original_filename: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  document_name: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @AutoMap()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  count?: number;

  @AutoMap()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  expiry_date?: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  address: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  name: string;

  @AutoMap()
  effective_date?: Date;

  @AutoMap()
  uploaded_at?: Date;

  @AutoMap()
  compliance_id?: ObjectId;

  @AutoMap()
  document_type_uuid: string;

  @AutoMap()
  item_type: string;

  @AutoMap()
  item_id: ObjectId;

  @AutoMap()
  contact_name: string;
}
