import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class VendorPartialResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  username: string;

  contacts_id: ObjectId[];

  @AutoMap()
  email: string;

  @AutoMap()
  first_name: string;

  @AutoMap()
  last_name: string;

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
  vendor_name: string;

  @AutoMap()
  alias: string;

  @AutoMap()
  phone_number: string;

  @AutoMap()
  scope_of_work: string;

  @AutoMap()
  title: string;

  @AutoMap()
  direct_dial: number;

  @AutoMap()
  project_count: number;
}
