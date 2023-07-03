import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MATERIAL_DOCS_CERTS_UPDATE_ENUM } from 'als/building-block/utils/enum';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class MaterialDocumentAndCertificateUpdate {
  @ApiProperty({ description: 'must be a valid material doc or cert id' })
  @IsMongoId()
  @IsNotEmpty()
  _id: ObjectId;

  @ApiProperty({ description: 'must be a valid string' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(
    [
      MATERIAL_DOCS_CERTS_UPDATE_ENUM.MATERIAL_DOCS,
      MATERIAL_DOCS_CERTS_UPDATE_ENUM.CERTS,
    ],
    {
      message: `type must be of the following values [${MATERIAL_DOCS_CERTS_UPDATE_ENUM.MATERIAL_DOCS}, ${MATERIAL_DOCS_CERTS_UPDATE_ENUM.CERTS}]`,
    },
  )
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  vers_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comments: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['G', 'Y', 'R'], {
    message: "status must be of the following values ['G', 'Y', 'R']",
  })
  status: string;
}
