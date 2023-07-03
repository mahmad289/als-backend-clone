import { ApiProperty } from '@nestjs/swagger';
import { TEMPLATE_TYPE_QUERY_ENUM } from 'als/building-block/utils/enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CoiRequirementDto {
  @ApiProperty({
    description: 'document type',
    default: TEMPLATE_TYPE_QUERY_ENUM.ACCORD_25,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(
    [TEMPLATE_TYPE_QUERY_ENUM.ACCORD_25, TEMPLATE_TYPE_QUERY_ENUM.ACCORD_28],
    {
      message: `document type must be one of the following [${TEMPLATE_TYPE_QUERY_ENUM.ACCORD_25}, ${TEMPLATE_TYPE_QUERY_ENUM.ACCORD_28}]`,
    },
  )
  document_type_name: string;
}
