import { AutoNotificationCreator } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationCreator';
import { AutoNotificationUpdate } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { AssignProjectCompleteResponseDto } from 'als/building-block/TransferableDto/AssignProject/AssignProject';
import { AutoNotificationResponse } from 'als/building-block/TransferableDto/AutoNotification/AutoNotifcation';
import { CommunicationTemplateCompleteResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommunicationTemplate';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { UserCompleteResponseDto } from 'als/building-block/TransferableDto/User/User';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';
import { ObjectId } from 'mongodb';

export abstract class IAutoNotificationService {
  abstract create(
    createPayloadDto: AutoNotificationCreator,
  ): Promise<AutoNotificationResponse>;
  abstract getById(id: string): Promise<AutoNotificationResponse>;
  abstract update(
    id: string,
    updatePayloadDto: AutoNotificationUpdate,
  ): Promise<AutoNotificationResponse | null>;
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<AutoNotificationResponse>>;
  abstract deleteAll(): Promise<void>;
  // FIXME
  abstract sendNotificationEmailToVendorContacts(
    vendor_id: string,
    template_id: CommunicationTemplateCompleteResponseDto,
    sender: UserCompleteResponseDto,
    autoNotification: AutoNotificationResponse,
    deficiency_list: string[],
    document_list: string[],
    uuid: AssignProjectCompleteResponseDto[],
    vendorCompliance: ComplianceCompleteResponsDto,
  ): Promise<void>;

  abstract sendNotificationEmailToProjectContacts(
    project_id: string,
    template: CommunicationTemplateCompleteResponseDto,
    sender: UserCompleteResponseDto,
    notification_id: string,
  ): Promise<void>;

  abstract sendNotificationEmailToClientContacts(
    client_id: string,
    template: CommunicationTemplateCompleteResponseDto,
    sender: UserCompleteResponseDto,
    notification_id: string,
  ): Promise<void>;

  abstract getRecursiveNotifications(): Promise<AutoNotificationResponse[]>;

  abstract getOneTimeNotifications(): Promise<AutoNotificationResponse[]>;

  abstract startNotificationJob(): Promise<void>;

  abstract toggleNotification(id: string): Promise<AutoNotificationResponse>;
  abstract getRecipientsCount(id: string): Promise<Record<string, number>>;

  abstract softDelete(id: string): Promise<any>;
  abstract getRequestDeficiencyList(
    vendor_id: ObjectId,
    project_id: ObjectId,
  ): Promise<any>;
}
