import { AutoMap } from '@automapper/classes';
import { TemplateModelDocument } from 'als/manager/requirement-group/model/template.model';
import { ObjectId } from 'mongodb';

export class RequirementsPartialResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  requirement_items: ObjectId[];

  @AutoMap()
  total_assignments: number;

  @AutoMap()
  acord25template_id: TemplateModelDocument[] | [] | ObjectId;

  @AutoMap()
  acord28template_id: TemplateModelDocument[] | [] | ObjectId;
}
