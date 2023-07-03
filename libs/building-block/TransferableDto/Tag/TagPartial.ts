import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class TagPartialResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  parent: ObjectId | null;

  @AutoMap()
  active: boolean;

  @AutoMap()
  children: TagPartialResponseDto[];
}
