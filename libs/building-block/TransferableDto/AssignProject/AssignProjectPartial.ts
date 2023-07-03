import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class ProjectPartialResponseDto {
  @AutoMap()
  vendor_id: ObjectId;

  @AutoMap()
  requirement_group_id: ObjectId;

  @AutoMap()
  compliance_id: ObjectId;

  @AutoMap()
  project_id: ObjectId;

  @AutoMap()
  contact_id: ObjectId;
}
