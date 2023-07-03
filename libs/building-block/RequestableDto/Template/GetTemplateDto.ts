import { ApiProperty } from '@nestjs/swagger';
import { TEMPLATE_TYPE_QUERY_ENUM } from 'als/building-block/utils/enum';
import { IsNotEmpty } from 'class-validator';

export class GetTemplateDto {
  @IsNotEmpty()
  @ApiProperty({
    enumName: 'Template Type',
    enum: TEMPLATE_TYPE_QUERY_ENUM,
    description: 'The type of template to retrieve',
  })
  type: TEMPLATE_TYPE_QUERY_ENUM;
}
