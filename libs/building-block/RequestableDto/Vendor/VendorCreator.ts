import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmailOrEmpty } from 'als/building-block/utils/decorator';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class VendorCreator {
  @ApiProperty({ description: 'Username already exist.', default: 'php' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Email already exist.',
    default: 'php@yahoo.com',
  })
  @IsEmailOrEmpty()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ default: 'Alexandra' })
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiPropertyOptional({ default: 'daddario' })
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiPropertyOptional({ default: '10 JAY ST STE 509B, BROOKLYN, NY' })
  @IsOptional()
  @IsString()
  address_1: string;

  @ApiPropertyOptional({
    default:
      '	100 JAY ST APT 7A (From 7A To 7C Both of Odd and Even), BROOKLYN, NY',
  })
  @IsOptional()
  @IsString()
  address_2: string;

  @ApiPropertyOptional({ default: 'NEW YORK' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  tags: ObjectId[];

  @ApiPropertyOptional({ default: 'NEW YORK' })
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional({ default: '10003' })
  @IsOptional()
  @IsString()
  zip: string;

  @ApiProperty({
    description: 'Vendor name already exist.',
    default: 'Alexandra Daddario',
  })
  @IsString()
  @IsNotEmpty()
  vendor_name: string;

  @ApiProperty({ description: 'Alias already exist.', default: 'alex' })
  @IsOptional()
  @IsString()
  alias: string;

  @ApiProperty({
    description: 'Phone number already exist.',
    default: '18775639554',
  })
  @IsOptional()
  @IsString()
  phone_number: string;

  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  @IsOptional()
  contacts_id: ObjectId[];

  @ApiProperty({ description: 'Scope of Work', default: 'Unknown' })
  @IsString()
  @IsOptional()
  scope_of_work: string;

  @ApiProperty({ description: 'title', default: 'title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'direct dial', default: '3242' })
  @IsNumber()
  @IsOptional()
  direct_dial: number;
}
