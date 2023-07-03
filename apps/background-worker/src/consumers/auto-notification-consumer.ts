import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AUTO_NOTIFICATION_QUEUE,
  MAILER_QUEUE,
} from 'als/building-block/constants';
import { ServiceError } from 'als/building-block/utils/apiError';
import { COMMUNICATION_TEMPLATE_TYPE } from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import { AssignProjectModel } from 'als/manager/assign-project/assign-project.model';
import { AutoNotificationModel } from 'als/manager/auto-notification/auto-notification.model';
import { IAutoNotificationService } from 'als/manager/auto-notification/auto-notification.service';
import { ClientModel } from 'als/manager/client/client.model';
import { ICommunicationTemplateService } from 'als/manager/communication-template/communication-template.service';
import { ComplianceModel } from 'als/manager/compliance/model/compliance.model';
import { ProjectModel } from 'als/manager/project/project.model';
import { DocumentTypeModel } from 'als/manager/requirement-group/model/document-type.model';
import { MasterRequirementModel } from 'als/manager/requirement-group/model/master-requirement.model';
import { UserModel, UserModelDocument } from 'als/manager/user/user.model';
import { IUserService } from 'als/manager/user/user.service';
import { VendorModel } from 'als/manager/vendor/vendor.model';
import { Job, Queue } from 'bullmq';
import * as moment from 'moment';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Processor(AUTO_NOTIFICATION_QUEUE)
export class AutoNotificationServiceConsumer extends WorkerHost {
  constructor(
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
    @InjectModel(AutoNotificationModel.name)
    readonly AutoNotificationModel: Model<AutoNotificationModel>,
    @InjectModel(AssignProjectModel.name)
    readonly AssignProjectModel: Model<AssignProjectModel>,
    @InjectModel(UserModel.name)
    readonly UserModel: Model<UserModelDocument>,
    private userService: IUserService,
    private communicationTemplateService: ICommunicationTemplateService,
    private autoNotificationService: IAutoNotificationService,
    @InjectQueue(MAILER_QUEUE)
    private readonly mailerService: Queue,
  ) {
    super();
  }
  private readonly logger = new Logger(AutoNotificationServiceConsumer.name);

  async process(job: Job<any>): Promise<any> {
    try {
      if (job.data.autoNotifications.length > 0) {
        for (const autoNotification of job.data.autoNotifications) {
          // get template
          const template = await this.communicationTemplateService.getById(
            autoNotification.template.template_id.toString(),
          );

          if (!template) {
            throw new ServiceError(`Template not found`, HttpStatus.NOT_FOUND);
          }

          const sender = await this.userService.getById(
            autoNotification.sender.toString(),
          );

          if (!sender) {
            throw new ServiceError(`Sender not found`, HttpStatus.NOT_FOUND);
          }

          // get vendors based on tags
          const vendors = await this.VendorModel.find({
            tags: {
              $in: autoNotification.applies_to,
            },
          });

          // get clients based on tags
          const clients = await this.ClientModel.aggregate([
            {
              $match: {
                tags: {
                  $in: autoNotification.applies_to.map(
                    (item: string) => new ObjectId(item),
                  ),
                },
              },
            },
            {
              $lookup: {
                from: 'contactmodels',
                localField: 'contacts_id',
                foreignField: '_id',
                as: 'contacts_id',
              },
            },
            {
              $lookup: {
                from: 'usermodels',
                localField: 'company_manager',
                foreignField: '_id',
                as: 'company_manager',
              },
            },
            {
              $unwind: '$company_manager',
            },
          ]);

          // get projects based on tags
          const projects = await this.ProjectModel.find({
            tags: {
              $in: autoNotification.applies_to,
            },
          });

          const auto_project = await this.ProjectModel.findById(
            autoNotification.project_id,
          );

          const auto_client = await this.ClientModel.findById(
            auto_project?.client.client_id,
          );

          const auto_company_manager = await this.UserModel.findById(
            auto_client?.company_manager.toString(),
          );

          //in case for recursive notification
          if (autoNotification.schedule_type === 'every') {
            let notification_date;

            if (autoNotification.last_sent) {
              notification_date = moment(autoNotification.last_sent).add(
                autoNotification.days,
                'days',
              );
            } else {
              notification_date = moment(
                autoNotification._id.getTimestamp(),
              ).add(autoNotification.days, 'days');
            }

            if (notification_date.isSame(moment(), 'day')) {
              let recipents_email =
                '<p>Following vendors have recieved email</p>';

              //send notification email and update last sent date and update sent true
              if (vendors.length > 0) {
                for (const vendor of vendors) {
                  recipents_email += `<p>${vendor.vendor_name}</p>`;
                  // Send email to vendor contacts
                  const deficiency =
                    await this.autoNotificationService.getRequestDeficiencyList(
                      vendor._id,
                      autoNotification.project_id,
                    );

                  if (deficiency) {
                    const deficiency_list = deficiency?.masterRequirement?.map(
                      (item: any) => `<li>${item.requirement_description}</li>`,
                    );

                    const document_list = deficiency?.documents?.map(
                      (item: any) => `<li>${item.name}</li>`,
                    );

                    if (!deficiency?.dashboardLink) {
                      throw new ServiceError(
                        `Project assignment not found for vendor ${vendor.vendor_name}`,
                        HttpStatus.NOT_FOUND,
                      );
                    }

                    if (!deficiency?.vendorCompliance) {
                      throw new ServiceError(
                        `Compliance not found for vendor ${vendor.vendor_name}`,
                        HttpStatus.NOT_FOUND,
                      );
                    }

                    await this.autoNotificationService.sendNotificationEmailToVendorContacts(
                      vendor._id.toString(),
                      template,
                      sender,
                      autoNotification,
                      deficiency_list || [],
                      document_list || [],
                      deficiency?.dashboardLink,
                      deficiency?.vendorCompliance,
                    );
                  }
                }

                if (autoNotification.company_manager) {
                  const company_manager = auto_company_manager;
                  const mailOptions = {
                    to: company_manager?.email,
                    from: sender.email,
                    subject: company_manager?._id,
                    html: recipents_email,
                  };

                  this.mailerService.add(MAILER_QUEUE, mailOptions);
                }
              }
              /**
               *
               * NOTES:
               * Here we need to check if the template type is Request or Update
               * then don't send the email to client and project contacts
               *
               */

              if (
                template.template_type !==
                  COMMUNICATION_TEMPLATE_TYPE.AUTO_NOTIFICATION_REQUEST &&
                template.template_type !==
                  COMMUNICATION_TEMPLATE_TYPE.AUTO_NOTIFICATION_UPDATE
              ) {
                if (projects.length > 0) {
                  for (const project of projects) {
                    // Send email to project contacts
                    await this.autoNotificationService.sendNotificationEmailToProjectContacts(
                      project._id.toString(),
                      template,
                      sender,
                      autoNotification._id.toString(),
                    );
                  }
                }

                if (clients.length > 0) {
                  for (const client of clients) {
                    // Send email to client contacts
                    await this.autoNotificationService.sendNotificationEmailToClientContacts(
                      client._id.toString(),
                      template,
                      sender,
                      autoNotification._id.toString(),
                    );
                  }
                }
              }

              await this.AutoNotificationModel.updateOne(
                { _id: autoNotification._id },
                {
                  $set: {
                    last_sent: new Date(),
                    sent_times: autoNotification.sent_times + 1,
                  },
                },
              );
            }
          } else {
            //incase of one time notification
            //create vendor list for clients
            let recipents_email =
              '<p>Following vendors have received email</p>';

            let sendNotification = false;
            let sendNotificationToManager = false;
            for (const vendor of vendors) {
              const master_requirement_ids = [];
              const document_type_uuids = [];
              let projectAssignment;
              let complianceData;

              //check against each document type
              for (const doc_type of autoNotification.documents) {
                //get only latest record where expiry date is not null
                const compliances = await this.ComplianceModel.find({
                  vendor_id: vendor._id,
                  'compliance_items.document_type_uuid': doc_type,
                  'compliance_items.expiry_date': { $exists: true },
                  project_id: autoNotification.project_id,
                  status: true,
                })
                  .sort({ 'compliance_items.expiry_date': -1 })
                  .limit(1);

                const document_master_requirement_ids = [];
                //if record exist then prepare for sending notification

                if (compliances.length > 0) {
                  let notification_date;
                  projectAssignment = await this.AssignProjectModel.find({
                    compliance_id: compliances[0]._id,
                    vendor_id: vendor._id,
                  });
                  complianceData = await this.ComplianceModel.findOne({
                    _id: compliances[0]._id,
                  });

                  //get expiry date in the notifaction if doc_type matches
                  for (const comp_items of compliances[0].compliance_items) {
                    if (comp_items.document_type_uuid === doc_type) {
                      document_master_requirement_ids.push(
                        comp_items.master_requirement_id,
                      );
                      if (!notification_date) {
                        notification_date = moment(comp_items.expiry_date);
                      }
                    }
                  }

                  //add or subtract days based on before or after
                  switch (autoNotification.schedule_type) {
                    case 'before':
                      notification_date = moment(notification_date).subtract(
                        autoNotification.days,
                        'days',
                      );
                      break;
                    case 'after':
                      notification_date = moment(notification_date).add(
                        autoNotification.days,
                        'days',
                      );
                      break;
                  }

                  //check if notification date is same as today then send email
                  if (
                    notification_date &&
                    notification_date.isSame(moment(), 'day')
                  ) {
                    sendNotification = true;
                    sendNotificationToManager = true;
                    //add the array of master requirment of the expiring document
                    master_requirement_ids.push(
                      ...document_master_requirement_ids,
                    ); //add the uuid in the array
                    document_type_uuids.push(doc_type);
                    //get compliance
                    // vendorCompliance = compliances[0];
                  }
                }
              }

              if (sendNotification) {
                //get requirements according to master requirement id
                const masterRequirement =
                  await this.MasterRequirementModel.find({
                    _id: { $in: master_requirement_ids },
                  });

                //get docuemtn name from uuid
                const document = await this.DocumentTypeModel.find({
                  uuid: document_type_uuids,
                });

                const document_list = document.map(
                  item => `<li>${item.name}</li>`,
                );

                const deficiency_list = masterRequirement.map(
                  item => `<li>${item.requirement_description}</li>`,
                );

                if (
                  !projectAssignment ||
                  (Array.isArray(projectAssignment) &&
                    projectAssignment.length < 1)
                ) {
                  throw new ServiceError(
                    `Project assignment not found for vendor ${vendor.vendor_name}`,
                    HttpStatus.NOT_FOUND,
                  );
                }

                if (!complianceData) {
                  throw new ServiceError(
                    `Project assignment not found for vendor ${vendor.vendor_name}`,
                    HttpStatus.NOT_FOUND,
                  );
                }

                // const document_list = document?.name || '';
                //add name of the vendor to reciepents list
                recipents_email += `<p>${vendor.vendor_name}</p>`;
                //send email to vendor contacts

                await this.autoNotificationService.sendNotificationEmailToVendorContacts(
                  vendor._id.toString(),
                  template,
                  sender,
                  autoNotification,
                  deficiency_list,
                  document_list,
                  projectAssignment,
                  complianceData,
                );

                //check if projects are associated with in tag and send them email
                // if (projects.length > 0) {
                //   for (const project of projects) {
                //     console.log('case 1 => project');
                // // Send email to project contacts
                //     await this.autoNotificationService.sendNotificationEmailToProjectContacts(
                //       project._id.toString(),
                //       template,
                //       sender,
                //       autoNotification._id.toString(),
                //     );
                //   }
                // }

                //check if client are associated with in tag and send them email
                // if (clients.length > 0) {
                //   for (const client of clients) {
                //     console.log('case 1 => client');
                //     await this.autoNotificationService.sendNotificationEmailToClientContacts(
                //       client._id.toString(),
                //       template,
                //       sender,
                //       autoNotification._id.toString(),
                //     );
                //   }
                // }
              }

              sendNotification = false;
            }

            if (autoNotification.company_manager && sendNotificationToManager) {
              const company_manager = auto_company_manager;
              const mailOptions = {
                to: company_manager?.email,
                from: sender.email,
                subject: company_manager?._id,
                html: recipents_email,
              };

              this.mailerService.add(MAILER_QUEUE, mailOptions);
            }

            //send email to company manager regarding list of vendors recieved email
            //check if client are associated with in tag and send them email

            if (
              template.template_type !==
                COMMUNICATION_TEMPLATE_TYPE.AUTO_NOTIFICATION_REQUEST &&
              template.template_type !==
                COMMUNICATION_TEMPLATE_TYPE.AUTO_NOTIFICATION_UPDATE
            ) {
              if (clients.length > 0) {
                for (const client of clients) {
                  await this.autoNotificationService.sendNotificationEmailToClientContacts(
                    client._id.toString(),
                    template,
                    sender,
                    autoNotification._id.toString(),
                  );
                }
              }

              if (projects.length > 0) {
                for (const project of projects) {
                  await this.autoNotificationService.sendNotificationEmailToProjectContacts(
                    project._id.toString(),
                    template,
                    sender,
                    autoNotification._id.toString(),
                  );
                }
              }
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw errorHandler(error);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<unknown>) {
    this.logger.log(`The Notification Job was completed: ${job.id}`);
  }
}
