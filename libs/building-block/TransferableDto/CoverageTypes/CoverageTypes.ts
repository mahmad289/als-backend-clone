import { AutoMap } from '@automapper/classes';
import { ObjectId } from 'mongodb';

export class CoverageTypeCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  uuid: string;
}
