import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CONTACT_TYPE_CATEGORY_ENUM,
  CONTACT_TYPE_ENUM,
} from 'als/building-block/utils/enum';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class ContactCreator {
  @ApiProperty({ description: 'first_name', default: 'john' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'last_name', default: 'wick' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'company_name', default: 'Spotten' })
  @IsString()
  company_name: string;

  @ApiProperty({ description: 'title', default: 'Spotten hiring' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'emai', default: 'john@spotten.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'phone_number', default: '9234456679' })
  @IsString()
  phone_number: string;

  @ApiPropertyOptional({ default: '318 WARREN ST APT 3, BROOKLYN, NY' })
  @IsOptional()
  @IsString()
  address_1: string;

  @ApiPropertyOptional({
    default:
      '318 WARREN ST APT A11 (From A11 To A17 Both of Odd and Even), BROOKLYN, NY',
  })
  @IsOptional()
  @IsString()
  address_2: string;

  @ApiPropertyOptional({ default: '55 WASHINGTON ST STE 252, BROOKLYN, NY' })
  @IsOptional()
  @IsString()
  address_3: string;

  @ApiPropertyOptional({ default: 'BROOKLYN' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({ default: 'New york' })
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional({ default: '11201' })
  @IsOptional()
  @IsString()
  zip: string;

  @ApiProperty({ description: 'Fax already exist.', default: '1234567' })
  @IsString()
  @IsOptional()
  fax: string;

  @ApiPropertyOptional({ default: 'direct' })
  @IsOptional()
  @IsString()
  direct: string;

  @ApiProperty({
    description: 'Mobile number already exist.',
    default: '03444456679',
  })
  @IsString()
  @IsOptional()
  mobile: string;

  @ApiProperty({
    description: 'type',
    default: 'Underwriter',
  })
  @IsEnum(CONTACT_TYPE_ENUM, {
    message: `type must be one of the following values [ 
          ${CONTACT_TYPE_ENUM.UNDERWRITER}
          ${CONTACT_TYPE_ENUM.LENDER}
          ${CONTACT_TYPE_ENUM.PROPERTY_MANAGER}
          ${CONTACT_TYPE_ENUM.BROKER}
          ${CONTACT_TYPE_ENUM.GENERAL_PARTNER}
          ${CONTACT_TYPE_ENUM.GENERAL_PARTNER_BROKER}
          ${CONTACT_TYPE_ENUM.GENERAL_CONTRACTOR}
          ${CONTACT_TYPE_ENUM.GENERAL_CONTRACTOR_BROKER}
          ${CONTACT_TYPE_ENUM.INSURANCE_COMPANY}
          ${CONTACT_TYPE_ENUM.CLIENT}
          ${CONTACT_TYPE_ENUM.RISK_MANAGER}
          ${CONTACT_TYPE_ENUM.PARTNERSHIP}
          ${CONTACT_TYPE_ENUM.ASSET_MANAGER} ,
          ${CONTACT_TYPE_ENUM.SALES_MANAGER} ,
          ${CONTACT_TYPE_ENUM.RELATIONSHIP_MANAGER},
        ]`,
  })
  type: string;

  @ApiProperty({
    description: 'contact_type',
    default: CONTACT_TYPE_CATEGORY_ENUM.CLIENT,
  })
  @IsEnum(
    [
      CONTACT_TYPE_CATEGORY_ENUM.CLIENT,
      CONTACT_TYPE_CATEGORY_ENUM.VENDOR,
      CONTACT_TYPE_CATEGORY_ENUM.PROJECT,
    ],
    {
      message: `contact type must be one of the following values [${CONTACT_TYPE_CATEGORY_ENUM.CLIENT}, ${CONTACT_TYPE_CATEGORY_ENUM.VENDOR}, ${CONTACT_TYPE_CATEGORY_ENUM.PROJECT}]`,
    },
  )
  contact_type: string;
}
