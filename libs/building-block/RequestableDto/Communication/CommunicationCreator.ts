import {
  COMMUNICATION_RECIPIENT_TYPE,
  COMMUNICATION_TYPE,
} from 'als/building-block/utils/enum';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class CommunicationCreator {
  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  vendor_id?: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  project_id: ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  contact_id: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  notification_id?: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  template_id?: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  compliance_id?: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  client_id?: ObjectId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  escalation_id?: ObjectId;

  @IsEnum(COMMUNICATION_TYPE, {
    message: `communication_type must be a valid enum value: ${COMMUNICATION_TYPE}`,
  })
  @IsNotEmpty()
  communication_type: string;

  @IsEnum(COMMUNICATION_RECIPIENT_TYPE, {
    message: `recipient_type must be a valid enum value: ${COMMUNICATION_RECIPIENT_TYPE}`,
  })
  @IsNotEmpty()
  recipient_type: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
