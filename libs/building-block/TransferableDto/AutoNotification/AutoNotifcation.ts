import { AutoMap } from '@automapper/classes';
import { Template } from 'als/manager/auto-notification/auto-notification.model';
import { ObjectId } from 'mongodb';

export class AutoNotificationResponse {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  name: string;

  @AutoMap()
  type: string;

  @AutoMap()
  applies_to: ObjectId[];

  @AutoMap()
  compliance_statuses: string[];

  @AutoMap()
  documents: string[];

  @AutoMap()
  days: number;

  @AutoMap()
  schedule_type: string;

  @AutoMap()
  template: Template;

  @AutoMap()
  active: boolean;

  @AutoMap()
  last_sent: Date;

  @AutoMap()
  sender: ObjectId;

  @AutoMap()
  project_id: ObjectId;

  @AutoMap()
  company_manager: boolean;

  @AutoMap()
  producer: boolean;

  @AutoMap()
  count: number;

  @AutoMap()
  sent_times: number;

  @AutoMap()
  project_name: string;
}
