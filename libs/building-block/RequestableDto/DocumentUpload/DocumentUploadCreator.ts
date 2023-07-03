import { AutoMap } from '@automapper/classes';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class DocumentUploadCreator {
  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  compliance_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsEnum(['compliance', 'template'], {
    message:
      "item type must be of the following values ['compliance','template']",
  })
  item_type: string;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  item_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  contact_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsBoolean()
  is_read: boolean;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  document_type_uuid: string;

  @AutoMap()
  @IsOptional()
  @IsMongoId()
  masterReqId?: ObjectId;

  @AutoMap()
  @IsOptional()
  @IsMongoId()
  templateRuleId?: ObjectId;
}
