import { AutoMap } from '@automapper/classes';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AssignProjectCreator {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  vendor_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  requirement_group_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  compliance_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  project_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  contact_id: ObjectId;
}
