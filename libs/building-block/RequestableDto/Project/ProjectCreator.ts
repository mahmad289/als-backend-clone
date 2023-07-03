import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PROJECT_DOCUMENT_TYPE_ENUM } from 'als/building-block/utils/enum';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

class Client {
  @ApiProperty({ description: 'must be a valid client id' })
  @IsNotEmpty()
  @IsMongoId()
  client_id: ObjectId;

  @ApiProperty({ description: 'must be a string' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

class Manager {
  @ApiProperty({ description: 'must be a valid Manager id' })
  @IsNotEmpty()
  @IsMongoId()
  manager_id: ObjectId;

  @ApiProperty({ description: 'must be a string' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
class Document {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(
    [
      PROJECT_DOCUMENT_TYPE_ENUM.EXECUTIVE_SUMMARY,
      PROJECT_DOCUMENT_TYPE_ENUM.ENDORSEMENTS,
      PROJECT_DOCUMENT_TYPE_ENUM.INSURANCE_REQUIREMENT,
      PROJECT_DOCUMENT_TYPE_ENUM.RISK_REPORT,
      PROJECT_DOCUMENT_TYPE_ENUM.ORGANIZATION_CHARTS,
    ],
    {
      message: `document type must be one of the following values  [${PROJECT_DOCUMENT_TYPE_ENUM.EXECUTIVE_SUMMARY},
        ${PROJECT_DOCUMENT_TYPE_ENUM.ENDORSEMENTS},
        ${PROJECT_DOCUMENT_TYPE_ENUM.INSURANCE_REQUIREMENT},
        ${PROJECT_DOCUMENT_TYPE_ENUM.RISK_REPORT},
        ${PROJECT_DOCUMENT_TYPE_ENUM.ORGANIZATION_CHARTS}]`,
    },
  )
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SingleDocument)
  documents: SingleDocument[];
}

export class SingleDocument {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  key: string;
}

export class ProjectCreator {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Client)
  @IsNotEmptyObject()
  client: Client;

  @ApiProperty({
    description: 'Project name already exist.',
    default: 'Project',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'brooklyn' })
  @IsString()
  @IsOptional()
  address_1: string;

  @ApiProperty({ default: 'USA' })
  @IsString()
  @IsOptional()
  address_2: string;

  @ApiProperty({ default: 'New york' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiPropertyOptional()
  @IsMongoId({ each: true })
  @IsOptional()
  tags?: ObjectId[];

  @ApiProperty({ default: 'New york' })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ default: '11203' })
  @IsString()
  @IsOptional()
  zip: string;

  @ApiProperty({ description: 'must be a string' })
  @IsString()
  @IsOptional()
  county: string;

  @ApiProperty({ description: 'must be a string' })
  @IsOptional()
  @IsString()
  property_name: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Manager)
  @IsNotEmptyObject()
  manager: Manager;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Document)
  documents: Document[];
}
