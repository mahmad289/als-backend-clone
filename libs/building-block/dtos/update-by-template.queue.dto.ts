import { AutoMap } from '@automapper/classes';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { COMPLIANCE_UPDATE_TEMPLATES } from '../utils/enum';

export class TemplateUpdateQueueDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  template_id: string;

  @AutoMap()
  @IsArray()
  rules_id: string[];

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  action:
    | COMPLIANCE_UPDATE_TEMPLATES.ADDED
    | COMPLIANCE_UPDATE_TEMPLATES.REMOVED;
}
