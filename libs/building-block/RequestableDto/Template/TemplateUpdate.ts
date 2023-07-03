import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { RuleDto } from './TemplateCreator';

export class TemplateUpdate {
  @ApiProperty({ type: [RuleDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RuleDto)
  rules: RuleDto[];
}

export class TemplateRuleUpdate {
  @ApiProperty({ type: String })
  @IsString()
  master_requirement_id: string;
}

export class TemplateNameUpdate {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  template_name: string;
}
