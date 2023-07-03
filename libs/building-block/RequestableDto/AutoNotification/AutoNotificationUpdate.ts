import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { AUTO_NOTIFICATION_COMPLIANCE_STATUS } from 'als/building-block/utils/enum';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

import { AutoNotificationCreator } from './AutoNotificationCreator';

class Template {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  template_id: ObjectId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  template_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  template_type?: string;
}
export class AutoNotificationUpdate extends PartialType(
  OmitType(AutoNotificationCreator, ['type'] as const),
) {
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  days: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['before', 'after', 'every'], {
    message: `type must be of the following values 'before' , 'after', 'every'`,
  })
  schedule_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  applies_to: ObjectId[];

  @ApiProperty()
  @IsArray()
  @IsEnum(
    [
      AUTO_NOTIFICATION_COMPLIANCE_STATUS.COMPLIANT,
      AUTO_NOTIFICATION_COMPLIANCE_STATUS.NOT_COMPLIANT_CRITICAL,
      AUTO_NOTIFICATION_COMPLIANCE_STATUS.NOT_COMPLIANT_NOT_CRITICAL,
    ],
    {
      each: true,
      message: `compliance_statuses must be of the following values 'compliant' , 'not_compliant_critical', 'not_compliant_not_critical'`,
    },
  )
  @ArrayMinSize(1)
  compliance_statuses: string[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Template)
  template: Template;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  sender: ObjectId;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  project_id: ObjectId;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  company_manager: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  producer: boolean;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  @ArrayMinSize(1)
  documents?: string[];

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @IsNotEmpty()
  count?: number;
}
