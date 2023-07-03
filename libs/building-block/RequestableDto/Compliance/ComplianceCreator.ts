import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ComplianceCreator {
  @IsMongoId()
  @IsNotEmpty()
  vendor_id: ObjectId;

  @IsString()
  @IsNotEmpty()
  vendor_name: string;

  @IsMongoId()
  @IsNotEmpty()
  project_id: ObjectId;

  @IsString()
  @IsNotEmpty()
  project_name: string;

  @IsMongoId()
  @IsNotEmpty()
  client_id: ObjectId;

  @IsString()
  @IsNotEmpty()
  client_name?: string;

  @IsMongoId()
  @IsNotEmpty()
  requirement_group_id: ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  user_id: ObjectId;
}
