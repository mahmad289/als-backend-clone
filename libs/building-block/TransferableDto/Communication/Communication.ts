import { AutoMap } from '@automapper/classes';
import { AutoNotificationModelDocument } from 'als/manager/auto-notification/auto-notification.model';
import { ContactModelDocument } from 'als/manager/contact/contact.model';
import { VendorModelDocument } from 'als/manager/vendor/vendor.model';
import { ObjectId } from 'mongodb';

export class CommunicationResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  vendor_id?: ObjectId;

  @AutoMap()
  vendor?: VendorModelDocument;

  @AutoMap()
  project_id?: ObjectId;

  @AutoMap()
  contact_id: ObjectId;

  @AutoMap()
  contact: ContactModelDocument;

  @AutoMap()
  notification_id?: ObjectId;

  @AutoMap()
  notification?: AutoNotificationModelDocument;

  @AutoMap()
  template_id?: ObjectId;

  @AutoMap()
  compliance_id?: ObjectId;

  @AutoMap()
  client_id?: ObjectId;

  @AutoMap()
  escalation_id?: ObjectId;

  @AutoMap()
  communication_type: string;

  @AutoMap()
  recipient_type: string;

  @AutoMap()
  subject: string;

  @AutoMap()
  body: string;

  @AutoMap()
  timestamp: Date;
}
