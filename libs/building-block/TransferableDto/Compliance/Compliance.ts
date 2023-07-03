import { AutoMap } from '@automapper/classes';
import {
  ComplianceItems,
  TemplateItems,
} from 'als/manager/compliance/model/compliance.model';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

import { ProjectCompleteResponseDTO } from '../Project/Project';

export class ComplianceCompleteResponsDto {
  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  vendor_id: ObjectId;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  vendor_name: string;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  project_id: ObjectId;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  escalation_id: ObjectId;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @AutoMap()
  @Type(() => ProjectCompleteResponseDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  project: ProjectCompleteResponseDTO;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  client_id: ObjectId;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  requirement_group_id: ObjectId;

  @AutoMap()
  @IsOptional()
  @IsArray()
  compliance_items: ComplianceItems[];

  @AutoMap()
  @IsOptional()
  @IsArray()
  template_items: TemplateItems[];

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  user_id: ObjectId;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  _id: ObjectId;

  @AutoMap()
  @IsBoolean()
  in_escalation: boolean;

  @AutoMap()
  @IsOptional()
  status: boolean;

  @AutoMap()
  @IsOptional()
  acord_28_ocr_data?: Record<string, any>;

  @AutoMap()
  @IsOptional()
  acord_25_ocr_data?: Record<string, any>;
}
