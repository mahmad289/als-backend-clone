import { AutoMap } from '@automapper/classes';
import { OmitType } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

import { MasterRequirementCompleteResponseDto } from '../MasterRequirement/MasterRequirement';

export class RequirementsCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  requirement_items: ObjectId[];

  @AutoMap()
  acord25template_id: ObjectId;

  @AutoMap()
  acord28template_id: ObjectId;
}

export class RequirementsCompletePopulatedResponseDto extends OmitType(
  RequirementsCompleteResponseDto,
  ['requirement_items'] as const,
) {
  @AutoMap()
  requirement_items: MasterRequirementCompleteResponseDto[];
}
