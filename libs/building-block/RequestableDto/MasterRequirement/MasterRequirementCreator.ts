import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MasterRequirementCreator {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  coverage_type_uuid: string;

  @IsNotEmpty()
  @IsString()
  coverage_type_name: string;

  @IsNotEmpty()
  @IsString()
  document_type_uuid: string;

  @IsNotEmpty()
  @IsString()
  document_type_name: string;

  @IsNotEmpty()
  @IsString()
  requirement_description: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  requirement_rule: string;

  @IsNotEmpty()
  @IsString()
  default_comment: string;

  @IsNotEmpty()
  @IsString()
  OCR: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  OCR_KEY?: string[];
}
