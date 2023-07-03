import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class MasterRequirementCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  uuid: string;

  @AutoMap()
  coverage_type_uuid: string;

  @AutoMap()
  coverage_type_name: string;

  @AutoMap()
  document_type_uuid: string;

  @AutoMap()
  document_type_name: string;

  @AutoMap()
  requirement_description: string;

  @AutoMap()
  requirement_rule: string;

  @AutoMap()
  default_comment: string;

  @AutoMap()
  OCR: string;

  @AutoMap()
  OCR_KEY: string[];
}
