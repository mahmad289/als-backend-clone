import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class DocumentTypeResponseDto {
  @AutoMap()
  _id: ObjectId;
  @AutoMap()
  uuid: string;
  @AutoMap()
  document_category_uuid: string;
  @AutoMap()
  name: string;
}
