import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class ClientCompleteResponseDto {
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

  @AutoMap()
  company_manager: any;
}
