import { AutoMap } from '@automapper/classes';
import { VendorModel } from 'als/manager/vendor/vendor.model';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { FlattenMaps, LeanDocument } from 'mongoose';

export class DocumentUploadCompleteResponseDto {
  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  _id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  compliance: any;

  @AutoMap()
  @IsNotEmpty()
  @IsEnum(['compliance', 'template'], {
    message:
      "item type must be of the following values ['compliance','template']",
  })
  item_type: string;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  item_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  contact_id: ObjectId;

  @AutoMap()
  @IsNotEmpty()
  @IsBoolean()
  is_read: boolean;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  document_type_uuid: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  document_type_name: string;

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  created_at: Date;
}

export class DocumentUploadDetailResponseDto extends DocumentUploadCompleteResponseDto {
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  vendor?: FlattenMaps<LeanDocument<VendorModel>> | null;
}
