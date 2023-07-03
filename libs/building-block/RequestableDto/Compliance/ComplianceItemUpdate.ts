import { ApiProperty } from '@nestjs/swagger';
import { COMPLIANCE_ITEM_STATUS_ENUM } from 'als/building-block/utils/enum';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class complianceItemProperty {
  @IsMongoId()
  @IsNotEmpty()
  _id: ObjectId;

  @IsEnum(
    [
      COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN,
      COMPLIANCE_ITEM_STATUS_ENUM.STATUS_YELLOW,
      COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
      COMPLIANCE_ITEM_STATUS_ENUM.STATUS_NA,
    ],
    {
      message: `status must be of the following values [${COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN},${COMPLIANCE_ITEM_STATUS_ENUM.STATUS_YELLOW},${COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED},${COMPLIANCE_ITEM_STATUS_ENUM.STATUS_NA}]`,
    },
  )
  @IsNotEmpty()
  @IsOptional()
  status: string;

  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment: string;

  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  actual_limit: string;

  @ApiProperty({ default: '', required: false })
  @IsBoolean()
  @IsOptional()
  show: boolean;

  @ApiProperty({ default: '', required: false })
  @IsBoolean()
  @IsOptional()
  waiver: boolean;

  @ApiProperty({ default: '', required: false })
  @IsBoolean()
  @IsOptional()
  post_closing: boolean;
}

export class ComplianceItemUpdateDto {
  @ApiProperty({ type: complianceItemProperty })
  @Type(() => complianceItemProperty)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  compliance_item: complianceItemProperty;

  @ApiProperty({ type: complianceItemProperty })
  @Type(() => complianceItemProperty)
  @ValidateNested()
  @IsNotEmptyObject()
  @IsOptional()
  template_item: complianceItemProperty;
}
