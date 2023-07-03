import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { AdditionalInsured } from './ProjectUpdate';

export class ProjectAdditionalInsuredUpdateDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalInsured)
  additional_insured: AdditionalInsured[];
}
