import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class UserCompleteResponseDto {
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

export class UserCompleteResponsewithPasswordDto extends UserCompleteResponseDto {
  @AutoMap()
  password: string;
}
