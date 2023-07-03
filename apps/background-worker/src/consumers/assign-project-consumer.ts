import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MAILER_QUEUE,
  PROJECT_ASSIGNEE_QUEUE,
} from 'als/building-block/constants';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import {
  COMMUNICATION_RECIPIENT_TYPE,
  COMMUNICATION_TYPE,
} from 'als/building-block/utils/enum';
import {
  AssignProjectModel,
  AssignProjectModelDocument,
} from 'als/manager/assign-project/assign-project.model';
import { IAssignProjectService } from 'als/manager/assign-project/assign-project.service';
import { ICommunicationService } from 'als/manager/communication/communication.service';
import { IContactService } from 'als/manager/contact/contact.service';
import { IProjectService } from 'als/manager/project/project-service';
import { IVendorService } from 'als/manager/vendor/vendor.service';
import { Job, Queue } from 'bullmq';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Processor(PROJECT_ASSIGNEE_QUEUE)
export class ProjectAssigneeConsumer extends WorkerHost {
  constructor(
    private readonly vendorService: IVendorService,
    private assignProjectService: IAssignProjectService,
    private contactService: IContactService,
    private projectService: IProjectService,

    @InjectQueue(MAILER_QUEUE)
    private readonly mailerService: Queue,
    private communicationService: ICommunicationService,
    @InjectModel(AssignProjectModel.name)
    readonly assignProjectModel: Model<AssignProjectModelDocument>,
  ) {
    super();
  }
  private readonly logger = new Logger(ProjectAssigneeConsumer.name);

  async process(job: Job<ComplianceCompleteResponsDto>): Promise<any> {
    const vendor = await this.vendorService.getById(
      job.data.vendor_id.toString(),
    );

    if (!vendor) {
      this.logger.log(
        `Vendor:${job.data.vendor_id} Missing While Assigning Compliance:${job.data.compliance_items} on project: ${job.data.project_id}`,
      );
      return;
    }

    const matched_contacts: any[] = [];
    const contact_array: any[] = [];
    // extract contact ids from vendor.contacts and push into contact_array
    const vendorContactLenght = vendor.contacts.length;
    for (let i = 0; i < vendorContactLenght; i++) {
      contact_array.push(vendor.contacts[i]._id);
    }

    // get all assigned projects for this compliance if contact_id is in contact_array push into matched_contacts
    const assigned_projects = await this.assignProjectModel.find({
      project_id: job.data.project_id,
      vendor_id: job.data.vendor_id,
      contact_id: { $in: contact_array },
    });

    // if matched, push into matched_contacts
    if (assigned_projects && assigned_projects.length > 0) {
      assigned_projects.map((project: any) => {
        matched_contacts.push(project.contact_id);
      });
    }

    // compare matched_contacts with vendor.contacts, if exist, remove from vendor.contacts
    if (matched_contacts && matched_contacts.length > 0) {
      matched_contacts.map((matched_contact: any) => {
        vendor.contacts = vendor.contacts.filter(
          (contact: any) =>
            contact._id.toString() !== matched_contact.toString(),
        );
      });
    }

    if (vendor.contacts && vendor.contacts.length > 0) {
      vendor.contacts.map(async (cont: any) => {
        const assigned_project = {
          uuid: uuidv4(),
          vendor_id: job.data.vendor_id,
          requirement_group_id: job.data.requirement_group_id,
          project_id: job.data.project_id,
          compliance_id: job.data._id,
          contact_id: cont._id,
        };

        const assignProject = await this.assignProjectService.create(
          assigned_project,
        );

        const project = await this.projectService.getById(
          assignProject.project_id.toString(),
        );

        const vendor = await this.vendorService.getById(
          assignProject.vendor_id.toString(),
        );

        const contact = await this.contactService.getById(
          assignProject.contact_id.toString(),
        );

        if (contact && !contact.email.includes('@yopmail.com')) {
          const mailOptions = {
            to: contact.email,
            subject: `Risk Comply Onboarding: Let's Dive In and Get You Set Up`,
            html: `<br/><p>Dear user, you have been assigned by <strong>${
              vendor?.vendor_name
            } </strong>to work on Project <strong>${
              project?.name
            } </strong>for Client<strong> ${
              project?.client.name
            }</strong>.<br></br> Please use the following link to login into your dashboard <a href="${
              process.env.BASE_URL +
              '/auth/verification?identifire=' +
              assignProject.uuid
            }">${
              process.env.BASE_URL +
              '/auth/verification?identifire=' +
              assignProject.uuid
            }</a></p>`,
          };

          this.mailerService.add(MAILER_QUEUE, mailOptions);

          const mail_body = {
            contact_id: contact._id,
            compliance_id: assignProject.compliance_id,
            project_id: assignProject.project_id,
            vendor_id: assignProject.vendor_id,
            subject: `Risk Comply Onboarding: Let's Dive In and Get You Set Up`,
            body: `<br/><p>Dear user,you have been assigned by <strong>${
              vendor?.vendor_name
            } </strong>to work on Project <strong>${
              project?.name
            } </strong>for Client<strong> ${
              project?.client.name
            }</strong>.<br></br> Please use the following link to login into your dashboard <a href="${
              process.env.BASE_URL +
              '/auth/verification?identifire=' +
              assignProject.uuid
            }">${
              process.env.BASE_URL +
              '/auth/verification?identifire=' +
              assignProject.uuid
            }</a></p>`,
            communication_type: COMMUNICATION_TYPE.ONBOARDING,
            recipient_type: COMMUNICATION_RECIPIENT_TYPE.VENDOR,
          };

          await this.communicationService.create(mail_body);
        }
      });
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<unknown>) {
    this.logger.log(`The Assignment Job was completed: ${job.id}`);
  }
}
