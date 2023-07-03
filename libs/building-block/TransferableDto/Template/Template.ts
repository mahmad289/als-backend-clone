import { AutoMap } from '@automapper/classes';
import { RuleEntity } from 'als/manager/requirement-group/model/template.model';
import { ObjectId } from 'mongodb';

export class TemplateCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  template_name: string;

  @AutoMap(() => RuleEntity)
  rules: RuleEntity[];

  @AutoMap()
  active: boolean;

  @AutoMap()
  type: string;
}
