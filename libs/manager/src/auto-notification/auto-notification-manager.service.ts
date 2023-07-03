import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AUTO_NOTIFICATION_QUEUE,
  MAILER_QUEUE,
} from 'als/building-block/constants';
import { AutoNotificationCreator } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationCreator';
import { AutoNotificationUpdate } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { AssignProjectCompleteResponseDto } from 'als/building-block/TransferableDto/AssignProject/AssignProject';
import { AutoNotificationResponse } from 'als/building-block/TransferableDto/AutoNotification/AutoNotifcation';
import { CommunicationTemplateCompleteResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommunicationTemplate';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { UserCompleteResponseDto } from 'als/building-block/TransferableDto/User/User';
import { ServiceError } from 'als/building-block/utils/apiError';
import {
  AUTO_NOTIFICATION_ENTITIES,
  COMMUNICATION_RECIPIENT_TYPE,
  COMMUNICATION_TYPE,
  CONTACT_TYPE_ENUM,
} from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { Queue } from 'bullmq';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { AssignProjectModel } from '../assign-project/assign-project.model';
import { ClientModel } from '../client/client.model';
import { IClientService } from '../client/client.service';
import { CommunicationModel } from '../communication/communication.model';
import { ICommunicationService } from '../communication/communication.service';
import { ComplianceModel } from '../compliance/model/compliance.model';
import { ProjectModel } from '../project/project.model';
import { IProjectService } from '../project/project-service';
import { DocumentTypeModel } from '../requirement-group/model/document-type.model';
import { MasterRequirementModel } from '../requirement-group/model/master-requirement.model';
import { VendorModel } from '../vendor/vendor.model';
import { IVendorService } from '../vendor/vendor.service';
import {
  AutoNotificationModel as autoNotificationModel,
  AutoNotificationModelDocument,
} from './auto-notification.model';
import { IAutoNotificationService } from './auto-notification.service';

@Injectable()
export class AutoNotificationManagerService
  extends AutomapperProfile
  implements IAutoNotificationService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(autoNotificationModel.name)
    readonly AutoNotificationModel: Model<AutoNotificationModelDocument>,
    @InjectModel(ComplianceModel.name)
    readonly ComplianceModel: Model<ComplianceModel>,
    @InjectModel(VendorModel.name)
    readonly VendorModel: Model<VendorModel>,
    @InjectModel(ClientModel.name)
    readonly ClientModel: Model<ClientModel>,
    @InjectModel(ProjectModel.name)
    readonly ProjectModel: Model<ProjectModel>,
    @InjectModel(DocumentTypeModel.name)
    readonly DocumentTypeModel: Model<DocumentTypeModel>,
    @InjectModel(MasterRequirementModel.name)
    readonly MasterRequirementModel: Model<MasterRequirementModel>,
    @InjectModel(AssignProjectModel.name)
    readonly AssignProjectModel: Model<AssignProjectModel>,
    @InjectModel(CommunicationModel.name)
    readonly CommunicationModel: Model<CommunicationModel>,
    private vendorService: IVendorService,
    private projectService: IProjectService,
    private clientService: IClientService,
    @InjectQueue(MAILER_QUEUE)
    private readonly mailerService: Queue,
    @InjectQueue(AUTO_NOTIFICATION_QUEUE)
    private readonly autoNotificationQueue: Queue,
    private communicationService: ICommunicationService,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        autoNotificationModel,
        AutoNotificationResponse,
        forMember(
          d => d._id,
          mapFrom(s => s._id),
        ),
        forMember(
          d => d.compliance_statuses,
          mapFrom(s => s.compliance_statuses),
        ),
        forMember(
          d => d.template,
          mapFrom(s => s.template),
        ),
        forMember(
          d => d.documents,
          mapFrom(s => s.documents),
        ),
        forMember(
          d => d.applies_to,
          mapFrom(s => s.applies_to),
        ),
      );
    };
  }

  async create(createPayloadDto: AutoNotificationCreator) {
    try {
      //this need to be set for demo purpose only
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const res = await this.AutoNotificationModel.create({
        ...createPayloadDto,
        last_sent: date,
      });

      return this.mapper.map(
        res,
        autoNotificationModel,
        AutoNotificationResponse,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      let res = await this.AutoNotificationModel.findOne({
        _id: id,
        is_deleted: false,
      });

      if (res) {
        const project = await this.ProjectModel.findById(res?.project_id);
        res = {
          ...JSON.parse(JSON.stringify(res)),
          project_name: project?.name,
        };
      }

      return this.mapper.map(
        res,
        autoNotificationModel,
        AutoNotificationResponse,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: AutoNotificationUpdate) {
    try {
      const res = await this.AutoNotificationModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      if (!res) {
        throw new ServiceError(
          `Auto Notification not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return this.mapper.map(
        res,
        autoNotificationModel,
        AutoNotificationResponse,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAll(query?: SearchableDto) {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          ['name', 'type', 'template.template_name'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount = await this.AutoNotificationModel.find({
        ...queryConditions,
        is_deleted: false,
      }).count();

      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.AutoNotificationModel.find({
        ...queryConditions,
        is_deleted: false,
      })
        .skip(skip)
        .limit(pagination.limit)
        .sort({ _id: -1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        autoNotificationModel,
        AutoNotificationResponse,
      );

      return {
        page,
        perPage: perPage ? perPage : totalCount,
        total: totalCount,
        data,
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteAll() {
    try {
      await this.AutoNotificationModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // FIXME
  async sendNotificationEmailToVendorContacts(
    vendor_id: string,
    template: CommunicationTemplateCompleteResponseDto,
    sender: UserCompleteResponseDto,
    autoNotification: AutoNotificationResponse,
    deficiency_list: string[],
    document_list: string[],
    dashboardLink: AssignProjectCompleteResponseDto[],
    vendorCompliance: ComplianceCompleteResponsDto,
  ) {
    try {
      const vendor: Record<string, any> | null =
        await this.vendorService.getById(vendor_id);

      const project: Record<string, any> | null =
        await this.projectService.getById(
          vendorCompliance.project_id.toString(),
        );

      const client: Record<string, any> | null =
        await this.clientService.getById(project?.client.client_id.toString());

      const vendorTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.VENDOR,
      );

      const contactTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.CONTACT,
      );

      const projectTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.PROJECT,
      );

      const clientTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.CLIENT,
      );

      let htmlTemplate = JSON.parse(JSON.stringify(template.template));
      for (const vendorTag of vendorTags) {
        if (vendor && htmlTemplate.includes(vendorTag.name)) {
          htmlTemplate = htmlTemplate.replaceAll(
            new RegExp(vendorTag.name, 'g'),
            vendor[vendorTag.resolve_to],
          );
        }

        for (const projectTag of projectTags) {
          if (project && htmlTemplate.includes(projectTag.name)) {
            htmlTemplate = htmlTemplate.replaceAll(
              new RegExp(projectTag.name, 'g'),
              project[projectTag.resolve_to],
            );
          }
        }

        for (const clientTag of clientTags) {
          if (client && htmlTemplate.includes(clientTag.name)) {
            htmlTemplate = htmlTemplate.replaceAll(
              new RegExp(clientTag.name, 'g'),
              client[clientTag.resolve_to],
            );
          }
        }

        const deficiency_list_data = deficiency_list.join('');
        const document_list_data = document_list.join('');
        htmlTemplate = await htmlTemplate.replaceAll(
          new RegExp(`##deficienciesList##`, 'g'),
          deficiency_list_data,
        );
        htmlTemplate = await htmlTemplate.replaceAll(
          new RegExp(`##documentList##`, 'g'),
          document_list_data,
        );
      }

      const deficiency_list_data = deficiency_list.join('');
      const document_list_data = document_list.join('');
      htmlTemplate = htmlTemplate.replaceAll(
        new RegExp(`##deficienciesList##`, 'g'),
        deficiency_list_data,
      );
      htmlTemplate = await htmlTemplate.replaceAll(
        new RegExp(`##documentList##`, 'g'),
        document_list_data,
      );

      for (const contact of vendor?.contacts) {
        const dashboardLinkItem = dashboardLink.find(
          item => item.contact_id.toString() === contact._id.toString(),
        );

        if (dashboardLinkItem) {
          const uuid = dashboardLinkItem.uuid;
          // create a copy of htmlTemplate for each iteration
          let htmlTemplateCopy = htmlTemplate;
          let mailOptions: Record<string, unknown> | null = null;
          for (const contactTag of contactTags) {
            if (contact && htmlTemplateCopy.includes(contactTag.name)) {
              htmlTemplateCopy = await htmlTemplateCopy.replaceAll(
                new RegExp(contactTag.name, 'g'),
                contact[contactTag.resolve_to],
              );
            }
          }

          const link = `${process.env.BASE_URL}/auth/verification?identifire=${uuid}`;
          htmlTemplateCopy = await htmlTemplateCopy.replaceAll(
            new RegExp(`#dashboardlink#`, 'g'),
            link,
          );

          if (contact.type === CONTACT_TYPE_ENUM.BROKER) {
            if (autoNotification.producer) {
              mailOptions = {
                to: contact.email,
                from: sender.email,
                // subject: vendor?._id,
                subject: template.subject,
                html: htmlTemplateCopy,
              };
            }
          } else {
            mailOptions = {
              to: contact.email,
              from: sender.email,
              // subject: vendor?._id,
              subject: template.subject,
              html: htmlTemplateCopy,
            };
          }

          const mail_body = {
            vendor_id: vendor?._id,
            notification_id: autoNotification._id,
            contact_id: contact._id,
            compliance_id: vendorCompliance._id,
            project_id: vendorCompliance.project_id,
            template_id: template._id,
            body: htmlTemplateCopy,
            subject: template.subject,
            communication_type: COMMUNICATION_TYPE.AUTO_NOTIFICATION,
            recipient_type: COMMUNICATION_RECIPIENT_TYPE.VENDOR,
          };

          await this.communicationService.create(mail_body);

          if (mailOptions) {
            this.mailerService.add(MAILER_QUEUE, mailOptions);
          }
        }
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async sendNotificationEmailToProjectContacts(
    project_id: string,
    template: CommunicationTemplateCompleteResponseDto,
    sender: UserCompleteResponseDto,
    notification_id: string,
  ) {
    try {
      const project: Record<string, any> | null =
        await this.projectService.getById(project_id);

      const projectTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.PROJECT,
      );

      const contactTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.CONTACT,
      );

      let htmlTemplate = JSON.parse(JSON.stringify(template.template));
      for (const projectTag of projectTags) {
        if (project && htmlTemplate.includes(projectTag.name)) {
          htmlTemplate = htmlTemplate.replaceAll(
            new RegExp(projectTag.name, 'g'),
            project[projectTag.resolve_to],
          );
        }
      }

      project?.contacts.forEach(async (contact: any) => {
        let mailOptions: Record<string, any> = {};
        for (const contactTag of contactTags) {
          if (contact && htmlTemplate.includes(contactTag.name)) {
            htmlTemplate = await htmlTemplate.replaceAll(
              new RegExp(contactTag.name, 'g'),
              contact[contactTag.resolve_to],
            );
          }
        }

        mailOptions = {
          to: contact.email,
          from: sender.email,
          // subject: project._id,
          subject: template.subject,
          html: htmlTemplate,
        };
        this.mailerService.add(MAILER_QUEUE, mailOptions);

        const mail_body = {
          notification_id: new ObjectId(notification_id),
          contact_id: contact._id,
          project_id: new ObjectId(project_id),
          template_id: template._id,
          subject: template.subject,
          body: htmlTemplate,
          communication_type: COMMUNICATION_TYPE.AUTO_NOTIFICATION,
          recipient_type: COMMUNICATION_RECIPIENT_TYPE.PROJECT,
        };

        await this.communicationService.create(mail_body);
      });
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async sendNotificationEmailToClientContacts(
    client_id: string,
    template: CommunicationTemplateCompleteResponseDto,
    sender: UserCompleteResponseDto,
    notification_id: string,
  ) {
    try {
      const client = await this.ClientModel.aggregate([
        {
          $match: { _id: new ObjectId(client_id) },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contacts_id',
            foreignField: '_id',
            as: 'contacts_id',
          },
        },
      ]);

      const clientTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.CLIENT,
      );

      const contactTags = template.tags.filter(
        tag => tag.entity_type === AUTO_NOTIFICATION_ENTITIES.CONTACT,
      );

      let htmlTemplate = JSON.parse(JSON.stringify(template.template));
      for (const clientTag of clientTags) {
        if (htmlTemplate.includes(clientTag.name)) {
          htmlTemplate = htmlTemplate.replaceAll(
            new RegExp(clientTag.name, 'g'),
            client[0][clientTag.resolve_to],
          );
        }
      }

      client[0].contacts_id.forEach(async (contact: any) => {
        let mailOptions: Record<string, any> = {};
        for (const contactTag of contactTags) {
          if (contact && htmlTemplate.includes(contactTag.name)) {
            htmlTemplate = await htmlTemplate.replaceAll(
              new RegExp(contactTag.name, 'g'),
              contact[contactTag.resolve_to],
            );
          }
        }

        mailOptions = {
          to: contact.email,
          from: sender.email,
          // subject: client[0]._id,
          subject: template.subject,
          html: htmlTemplate,
        };
        this.mailerService.add(MAILER_QUEUE, mailOptions);

        const mail_body = {
          notification_id: new ObjectId(notification_id),
          contact_id: contact._id,
          project_id: new ObjectId(client[0].project_id),
          client_id: new ObjectId(client_id),
          template_id: template._id,
          subject: template.subject,
          body: htmlTemplate,
          communication_type: COMMUNICATION_TYPE.AUTO_NOTIFICATION,
          recipient_type: COMMUNICATION_RECIPIENT_TYPE.CLIENT,
        };

        await this.communicationService.create(mail_body);
      });
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getRecursiveNotifications() {
    try {
      const autoNotifications = await this.AutoNotificationModel.find({
        active: true,
        is_deleted: false,
        schedule_type: 'every',
        $expr: { $lt: ['$sent_times', '$count'] },
        'template.template_id': { $exists: true },
        sender: { $exists: true },
      });

      return autoNotifications;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getOneTimeNotifications() {
    try {
      const autoNotifications = await this.AutoNotificationModel.find({
        active: true,
        is_deleted: false,
        schedule_type: {
          $ne: 'every',
        },
        'template.template_id': { $exists: true },
        sender: { $exists: true },
      });

      return autoNotifications;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  //function for recursive notification like every 4 days
  async sendNotifications(autoNotifications: AutoNotificationResponse[]) {
    try {
      // add to notification queue
      if (autoNotifications.length > 0) {
        await this.autoNotificationQueue.add(AUTO_NOTIFICATION_QUEUE, {
          autoNotifications,
        });
      }
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async startNotificationJob() {
    try {
      const recursiveNotifications = await this.getRecursiveNotifications();
      const oneTimeNotifications = await this.getOneTimeNotifications();

      await this.sendNotifications(recursiveNotifications);

      await this.sendNotifications(oneTimeNotifications);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async toggleNotification(id: string) {
    try {
      const autoNotification = await this.getById(id);

      if (!autoNotification) {
        throw new ServiceError(
          'Auto Notification not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.AutoNotificationModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            active: !autoNotification.active,
          },
        },
        { new: true },
      );

      return this.mapper.map(
        res,
        autoNotificationModel,
        AutoNotificationResponse,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async getRecipientsCount(id: string) {
    //in case we added clients and projects contacts as well
    //and want to search by vendors only
    //************ */
    // const res = await this.AutoNotificationModel.findById(id);
    // if (!res) {
    //   throw new ServiceError(
    //     'Auto Notification not found',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    // const vendors = await this.VendorModel.find({
    //   tags: res.applies_to,
    // });
    // if (vendors.length > 0) {
    //   const vendor_ids = vendors.map(vendor => vendor._id);
    //   const recipients = await this.RecipientModel.find({
    //     notification: new ObjectId(id),
    //     vendor: { $in: vendor_ids },
    //   }).count();
    //   return recipients;
    // }

    const vendorRecipients = await this.CommunicationModel.aggregate([
      {
        $match: {
          notification_id: new ObjectId(id),
          communication_type: 'auto_notification',
          recipient_type: 'vendor',
        },
      },
      {
        $group: {
          _id: '$vendor_id',
        },
      },
    ]);

    const projectRecipients = await this.CommunicationModel.aggregate([
      {
        $match: {
          notification_id: new ObjectId(id),
          communication_type: 'auto_notification',
          recipient_type: 'project',
        },
      },
      {
        $group: {
          _id: '$project_id',
        },
      },
    ]);

    const clientRecipients = await this.CommunicationModel.aggregate([
      {
        $match: {
          notification_id: new ObjectId(id),
          communication_type: 'auto_notification',
          recipient_type: 'client',
        },
      },
      {
        $group: {
          _id: '$client_id',
        },
      },
    ]);

    return {
      vendors: vendorRecipients.length,
      projects: projectRecipients.length,
      clients: clientRecipients.length,
    };
  }

  async softDelete(id: string) {
    try {
      const res = await this.AutoNotificationModel.findOneAndUpdate(
        {
          _id: id,
          is_deleted: false,
        },
        {
          is_deleted: true,
        },
        { new: true, overwrite: false },
      );

      if (!res) {
        throw new ServiceError(
          'Auto Notification not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getRequestDeficiencyList(
    vendor_id: ObjectId,
    project_id: ObjectId,
  ): Promise<any> {
    //get all comliances where document name is empty
    const complainces = await this.ComplianceModel.find({
      vendor_id: vendor_id,
      'compliance_items.document_name': '',
      project_id: project_id,
      status: true,
    });

    const compliance_items = [];
    const master_requirement_ids = [];
    const document_type_uuid = [];
    let masterRequirement;
    let documents;
    let dashboardLink;
    let vendorCompliance;

    //get all compliance items where document name is empty
    for (const compliance of complainces) {
      vendorCompliance = compliance;
      //get uuid link from the AssignProjectModel
      dashboardLink = await this.AssignProjectModel.find({
        compliance_id: compliance._id,
        vendor_id: vendor_id,
      });
      for (const compliance_item of compliance.compliance_items) {
        if (compliance_item.document_name === '') {
          compliance_items.push(compliance_item);
          master_requirement_ids.push(compliance_item.master_requirement_id);
          document_type_uuid.push(compliance_item.document_type_uuid);
          // requirement_description
          //we need to got through eacha compliance item and get the requirement description from master requirement
        }

        masterRequirement = await this.MasterRequirementModel.find({
          _id: { $in: master_requirement_ids },
        });

        documents = await this.DocumentTypeModel.find({
          uuid: { $in: document_type_uuid },
        });
      }

      return {
        masterRequirement,
        documents,
        dashboardLink,
        vendorCompliance,
      };
    }
  }
}
