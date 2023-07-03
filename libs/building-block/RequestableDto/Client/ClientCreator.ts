import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CLIENT_TYPE_ENUM } from 'als/building-block/utils/enum';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class ClientCreator {
  @ApiProperty({ description: 'Name already exist.', default: 'Harry' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'client_type',
    default: CLIENT_TYPE_ENUM.BANKING,
  })
  @IsEnum(
    [
      CLIENT_TYPE_ENUM.REAL_ESTATE_DEVELOPMENT,
      CLIENT_TYPE_ENUM.BANKING,
      CLIENT_TYPE_ENUM.RETAIL,
      CLIENT_TYPE_ENUM.ENERGY,
      CLIENT_TYPE_ENUM.HEALTHCARE,
      CLIENT_TYPE_ENUM.TRANSACTION_SERVICE_AND_PRIVATE_EQUITY,
      CLIENT_TYPE_ENUM.FINANCIAL_SERVICES,
      CLIENT_TYPE_ENUM.NON_PROFIT,
      CLIENT_TYPE_ENUM.TECHNOLOGY_AND_COMMUNICATION,
      CLIENT_TYPE_ENUM.CONSTRUCTION,
      CLIENT_TYPE_ENUM.GOVERNMENT,
      CLIENT_TYPE_ENUM.EDUCATION,
      CLIENT_TYPE_ENUM.MISCELLANEOUS,
      CLIENT_TYPE_ENUM.ENTERTAINMENT,
    ],
    {
      message: `client type must be of the following values [${CLIENT_TYPE_ENUM.REAL_ESTATE_DEVELOPMENT}, ${CLIENT_TYPE_ENUM.BANKING}, ${CLIENT_TYPE_ENUM.RETAIL}, ${CLIENT_TYPE_ENUM.ENERGY}, ${CLIENT_TYPE_ENUM.HEALTHCARE}, ${CLIENT_TYPE_ENUM.TRANSACTION_SERVICE_AND_PRIVATE_EQUITY}, ${CLIENT_TYPE_ENUM.FINANCIAL_SERVICES}, ${CLIENT_TYPE_ENUM.NON_PROFIT}, ${CLIENT_TYPE_ENUM.TECHNOLOGY_AND_COMMUNICATION}, ${CLIENT_TYPE_ENUM.CONSTRUCTION}, ${CLIENT_TYPE_ENUM.GOVERNMENT}, ${CLIENT_TYPE_ENUM.EDUCATION}, ${CLIENT_TYPE_ENUM.MISCELLANEOUS}, ${CLIENT_TYPE_ENUM.ENTERTAINMENT}]`,
    },
  )
  @IsString()
  @IsNotEmpty()
  client_type: string;

  @ApiPropertyOptional({ default: 'brooklyn' })
  @IsOptional()
  @IsString()
  address_1: string;

  @ApiPropertyOptional({ default: 'USA' })
  @IsOptional()
  @IsString()
  address_2: string;

  @ApiPropertyOptional({ default: 'New york' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsMongoId({ each: true })
  @IsOptional()
  tags?: ObjectId[];

  @ApiPropertyOptional({ default: 'New york' })
  @IsString()
  @IsOptional()
  state: string;

  @ApiPropertyOptional({ default: '11203' })
  @IsOptional()
  @IsString()
  zip: string;

  @ApiPropertyOptional({ default: 'contacts_id' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  contacts_id: ObjectId[];

  @ApiProperty({ default: 'user_id' })
  @IsMongoId()
  @IsNotEmpty()
  company_manager: ObjectId;
}
