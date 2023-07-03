import { AutoMap } from '@automapper/classes';
import { EntitiesInvolved } from 'als/manager/communication-template/communication-template.model';
import { ObjectId } from 'mongodb';

export class CommunicationTemplateCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  template_name: string;

  @AutoMap()
  template_type: string;

  @AutoMap()
  template: string;

  @AutoMap()
  subject: string;

  @AutoMap()
  system_generated: boolean;

  @AutoMap()
  created_by: ObjectId;

  @AutoMap(() => EntitiesInvolved)
  tags: EntitiesInvolved[];

  @AutoMap()
  created_on?: Date;
}
