import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class ContactPartialResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  first_name: string;

  @AutoMap()
  last_name: string;

  @AutoMap()
  company_name: string;

  @AutoMap()
  title: string;

  @AutoMap()
  email: string;

  @AutoMap()
  phone_number: string;

  @AutoMap()
  address_1: string;

  @AutoMap()
  address_2: string;

  @AutoMap()
  address_3: string;

  @AutoMap()
  city: string;

  @AutoMap()
  state: string;

  @AutoMap()
  zip: string;

  @AutoMap()
  fax: string;

  @AutoMap()
  direct: string;

  @AutoMap()
  mobile: string;

  @AutoMap()
  type: string;

  @AutoMap()
  contact_type: string;
}
