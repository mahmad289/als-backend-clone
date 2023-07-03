import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchableDto {
  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  limit: string;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  page: string;

  @ApiProperty({ default: '', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  keyword: string;
}

export class VendorDetailSearchableDto extends SearchableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'client id must be a valid mongodb id' })
  client_id: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'project id must be a valid mongodb id' })
  project_id: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'vendor id must be a valid mongodb id' })
  vendor_id: string | null;
}

export class GetDocumentsSearchableDto extends SearchableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'vendor id must be a valid mongodb id' })
  vendor_id: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'client id must be a valid mongodb id' })
  client_id: string | null;
}

export class InboxSearchableDto extends SearchableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'vendor id must be a valid mongodb id' })
  vendor_id: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'project id must be a valid mongodb id' })
  project_id: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'client id must be a valid mongodb id' })
  client_id: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString({ message: 'Read status must be a true or false' })
  is_read: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  start_date: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end_date: string;
}

export class FileSearchableDto extends SearchableDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'vendor id must be a valid mongodb id' })
  vendor_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId({ message: 'client id must be a valid mongodb id' })
  client_id?: string;

  @ApiProperty({ default: null, required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  doc_type_uuid: string;
}
