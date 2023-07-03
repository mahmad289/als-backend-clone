import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

import { COMPLIANCE_UPDATE_TEMPLATES } from '../utils/enum';

export class CompliacneUpdateOnRequirementRuleChangeDto {
  @AutoMap()
  @ApiProperty({ description: 'item_type' })
  @IsEnum(COMPLIANCE_UPDATE_TEMPLATES, {
    message: `action must be of the following values [${COMPLIANCE_UPDATE_TEMPLATES.ADDED}, ${COMPLIANCE_UPDATE_TEMPLATES.REMOVED}]`,
  })
  action:
    | COMPLIANCE_UPDATE_TEMPLATES.ADDED
    | COMPLIANCE_UPDATE_TEMPLATES.REMOVED;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  requirement_group_id: ObjectId;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  master_requirement_id: ObjectId;
}

export class CompliacneUpdateOnRequirementTempChangeDto {
  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  old_template_id: ObjectId | undefined;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  new_template_id: ObjectId;

  @AutoMap()
  @IsMongoId()
  @IsNotEmpty()
  requirement_group_id: ObjectId;
}
