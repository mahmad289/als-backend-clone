import { ApiProperty } from '@nestjs/swagger';
import { PROJECT_DOCUMENT_TYPE_ENUM } from 'als/building-block/utils/enum';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { SingleDocument } from './ProjectCreator';

export class ProjectDocsUpdateDto {
  @ApiProperty()
  @IsEnum(PROJECT_DOCUMENT_TYPE_ENUM, {
    message: `type must be a valid enum value: ${Object.values(
      PROJECT_DOCUMENT_TYPE_ENUM,
    )}`,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => SingleDocument)
  documents: SingleDocument[];
}
