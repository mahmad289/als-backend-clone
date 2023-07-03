import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class UserPartialResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  @AutoMap()
  phone_number: string;

  @AutoMap()
  role: string;

  @AutoMap()
  first_name: string;

  @AutoMap()
  last_name: string;

  @AutoMap()
  full_name: string;

  @AutoMap()
  img_url: string;
}
