import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { COMPLIANCE_ITEM_TYPE_ENUM } from 'als/building-block/utils/enum';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class DocumentNameUpdate {
  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  compliance_id: ObjectId;

  @ApiProperty({ description: 'item_type' })
  @AutoMap()
  @IsNotEmpty()
  @IsEnum(
    [COMPLIANCE_ITEM_TYPE_ENUM.COMPLIANCE, COMPLIANCE_ITEM_TYPE_ENUM.TEMPLATE],
    {
      message: `item type must be of the following values [${COMPLIANCE_ITEM_TYPE_ENUM.COMPLIANCE}, ${COMPLIANCE_ITEM_TYPE_ENUM.TEMPLATE}]`,
    },
  )
  item_type: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsMongoId()
  item_id: ObjectId;

  @ApiProperty({ description: 'original filename which is uploaded' })
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  original_filename: string;

  @ApiProperty({
    description: 'document type uuid of the original document type',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  document_type_uuid: string;
}
