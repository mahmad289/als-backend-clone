import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class TagCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  parent: ObjectId | null;

  @AutoMap()
  count: number;

  @AutoMap()
  active: boolean;

  @AutoMap()
  vendor_count: number;

  @AutoMap()
  children?: TagCompleteResponseDto[];
}
