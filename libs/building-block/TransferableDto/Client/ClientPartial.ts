import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class ClientPartialResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  contacts_id: ObjectId[];

  @AutoMap()
  client_type: string;

  @AutoMap()
  address_1: string;

  @AutoMap()
  address_2: string;

  @AutoMap()
  city: string;

  @AutoMap()
  tags: ObjectId[];

  @AutoMap()
  state: string;

  @AutoMap()
  zip: string;

  //is optional field to add total projects of a client in response
  @AutoMap()
  total_projects?: number;

  @AutoMap()
  company_manager: ObjectId;
}
