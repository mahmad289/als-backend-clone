import { ApiProperty } from '@nestjs/swagger';
import { COMPLIANCE_ITEM_TYPE_ENUM } from 'als/building-block/utils/enum';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class ComplianceUpdate {
  @ApiProperty({ description: 'file name which is uploaded' })
  @IsString()
  @IsNotEmpty()
  file_name: string;

  @ApiProperty({ description: 'original filename which is uploaded' })
  @IsString()
  @IsNotEmpty()
  original_filename: string;

  @ApiProperty({ description: 'item_type' })
  @IsEnum(
    [COMPLIANCE_ITEM_TYPE_ENUM.COMPLIANCE, COMPLIANCE_ITEM_TYPE_ENUM.TEMPLATE],
    {
      message: `item type must be of the following values [${COMPLIANCE_ITEM_TYPE_ENUM.COMPLIANCE}, ${COMPLIANCE_ITEM_TYPE_ENUM.TEMPLATE}]`,
    },
  )
  item_type: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  item_id: ObjectId;
}
