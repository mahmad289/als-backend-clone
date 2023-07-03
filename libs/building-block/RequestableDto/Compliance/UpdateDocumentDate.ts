import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateDocumentDateDto {
  @ApiProperty({ description: 'document type identifier' })
  @IsString()
  @IsNotEmpty()
  document_type_uuid: string;

  @ApiProperty({ description: 'effective date of the document' })
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  effective_date?: Date;

  @ApiProperty({ description: 'expiry date of the document' })
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  expiry_date?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(['compliance', 'template'], {
    message: `item_type must be one of the following [compliance, template]`,
  })
  item_type: string;
}
