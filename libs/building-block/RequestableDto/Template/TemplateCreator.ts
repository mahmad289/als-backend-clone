import { ApiProperty } from '@nestjs/swagger';
import { TEMPLATE_RULE_CONDITION_ENUM } from 'als/building-block/utils/enum';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export class RuleDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  master_requirement_id: ObjectId;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(
    [
      TEMPLATE_RULE_CONDITION_ENUM.REQUIRED,
      TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN,
      TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN_OR_EQUAL,
      TEMPLATE_RULE_CONDITION_ENUM.LESS_THAN,
    ],
    {
      message: `condition must be one of the following [${TEMPLATE_RULE_CONDITION_ENUM.REQUIRED},
          ${TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN},
          ${TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN_OR_EQUAL},
          ${TEMPLATE_RULE_CONDITION_ENUM.LESS_THAN}]`,
    },
  )
  condition: string;

  @ApiProperty({})
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_enabled: boolean;
}

export class TemplateCreator {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  template_name: string;

  @ApiProperty({ type: [RuleDto] })
  @ValidateNested({ each: true })
  @Type(() => RuleDto)
  rules: RuleDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(['Acord 25', 'Acord 28'], {
    message: `type must be one of the following [Acord 25, Acord 28]`,
  })
  type: string;
}
