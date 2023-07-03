import { AutoMap } from '@automapper/classes';
import { Client, Document, Manager } from 'als/manager/project/project.model';
import { ObjectId } from 'mongodb';

export class ProjectPartialResponseDTO {
  @AutoMap()
  _id: ObjectId;

  @AutoMap(() => Client)
  client: Client;

  @AutoMap()
  name: string;

  @AutoMap(() => Document)
  documents: Document[];

  @AutoMap()
  assigned_vendor_count: number;

  @AutoMap(() => Manager)
  manager: Manager;

  @AutoMap()
  tags: ObjectId[];
}
