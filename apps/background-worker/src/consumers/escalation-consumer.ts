import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ESCALATION_QUEUE, MAILER_QUEUE } from 'als/building-block/constants';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { EscalationResponseDto } from 'als/building-block/TransferableDto/Escalation/Escalation';
import {
  COMMUNICATION_RECIPIENT_TYPE,
  COMMUNICATION_TYPE,
} from 'als/building-block/utils/enum';
import { IClientService } from 'als/manager/client/client.service';
import { CommunicationModel } from 'als/manager/communication/communication.model';
import { ICommunicationService } from 'als/manager/communication/communication.service';
import {
  ComplianceItems,
  TemplateItems,
} from 'als/manager/compliance/model/compliance.model';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { IUserService } from 'als/manager/user/user.service';
import { Job, Queue } from 'bullmq';
import * as moment from 'moment';

@Processor(ESCALATION_QUEUE)
export class EscalationServiceConsumer extends WorkerHost {
  constructor(
    private readonly complianceServices: IComplianceService,
    private readonly clientService: IClientService,
    private readonly userService: IUserService,
    @InjectQueue(MAILER_QUEUE)
    private readonly mailerService: Queue,
    @InjectModel(CommunicationModel.name)
    private communicationService: ICommunicationService,
  ) {
    super();
  }
  private readonly logger = new Logger(EscalationServiceConsumer.name);

  async process(job: Job<EscalationResponseDto[]>): Promise<any> {
    this.logger.log(`Escalation job started`);
    for (const escalation of job.data) {
      const user = await this.userService.getById(
        escalation.user_id.toString(),
      );

      const complianceData: ComplianceCompleteResponsDto =
        await this.complianceServices.getById(
          escalation.compliance_id.toString(),
        );

      let htmlTemplate = `<br></br>Following is the list of Escalated Documents for Client <strong>${complianceData.client_name}</strong> pertaining to the project <strong>${complianceData.project_name}</strong> and involving vendor <strong>${complianceData.vendor_name}</strong>`;
      const client = await this.clientService.getById(
        complianceData.client_id.toString(),
      );

      const expire = [];
      const uploadList = [];
      const statusList = [];
      const escalation_des = `<br></br><strong>Escalation Description : </strong>${escalation.comments}<br/>`;

      for (const coverage of escalation.coverage_types) {
        const complianceItemscDeficiencyList = await this.checkDefieciency(
          complianceData.compliance_items,
          coverage,
        );

        const templateItemscDeficiencyList = await this.checkDefieciency(
          complianceData.template_items,
          coverage,
        );

        expire.push(
          ...complianceItemscDeficiencyList.expiryList,
          ...templateItemscDeficiencyList.expiryList,
        );
        uploadList.push(
          ...complianceItemscDeficiencyList.uploadList,
          ...templateItemscDeficiencyList.uploadList,
        );
        statusList.push(
          ...complianceItemscDeficiencyList.statusList,
          ...templateItemscDeficiencyList.statusList,
        );
      }

      let expiry_list = '<br><h2>Following are the Expiring Documents:</h2>';
      const expiringDocumentsByCoverage = groupBy(expire, 'coverage_name');

      for (const coverage in expiringDocumentsByCoverage) {
        const documents = expiringDocumentsByCoverage[coverage];
        const documentList = documents
          .map(
            (exp: EscalationData) =>
              `<ul><h4>Requirement:</h4> ${exp.description}</ul>
             <ul><h4>Document Name:</h4> ${exp.document_name}</ul>`,
          )
          .join('<hr>');

        expiry_list += `<hr><h3>Coverage Type: ${coverage}</h3><hr>${documentList}`;
      }

      let upload_list =
        '<br><h2>Following are the Documents with Missing Uploads:</h2>';

      const documentsWithMissingUploadsByCoverage = groupBy(
        uploadList,
        'coverage_name',
      );

      for (const coverage in documentsWithMissingUploadsByCoverage) {
        const documents = documentsWithMissingUploadsByCoverage[coverage];
        const documentList = documents
          .map(
            (exp: EscalationData) =>
              `<ul><h4>Requirement:</h4> ${exp.description}</ul>
             <ul><h4>Document Name:</h4> ${exp.document_name}</ul>`,
          )
          .join('<hr>');

        upload_list += `<hr><h3>Coverage Type: ${coverage}</h3><hr>${documentList}`;
      }

      let status_list =
        '<br><h2>Following are the Documents that are Non Compliant:</h2>';

      const nonCompliantDocumentsByCoverage = groupBy(
        statusList,
        'coverage_name',
      );

      for (const coverage in nonCompliantDocumentsByCoverage) {
        const documents = nonCompliantDocumentsByCoverage[coverage];
        const documentList = documents
          .map(
            (exp: EscalationData) =>
              `<ul><h4>Requirement:</h4> ${exp.description}</ul>  
             <ul><h4>Status:</h4> ${exp.status}</ul>`,
          )
          .join('<hr>');

        status_list += `<hr><h3>Coverage Type: ${coverage}</h3><hr>${documentList}`;
      }

      const footer = `<br>Thank you for your time and attention as we maintain compliance with our records.<br><br><br>Regards,<br><br></span></p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><br><br>If you have questions regarding this certificate request, please reply to this email.<br><br>If you have issues uploading your certificate, please email </span><a href="mailto:support@smartcompliance.co" target="_self"><span style="color: var(--bs-link-color);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;"><ins>support@theriskcomply.co</ins></span></a></p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;">&nbsp;</p>\n<p style="text-align:start;"></p>\n<p style="text-align:left;"><span style="color: rgb(29,29,29);background-color: rgb(255,255,255);font-size: 14px;font-family: Sf Pro Display Regular", sans-serif;">To stop receiving these communications please unsubscribe</span></p>\n`;

      htmlTemplate +=
        expiry_list + upload_list + status_list + escalation_des + footer;

      function groupBy(arr: Record<string, unknown>[], property: string) {
        return arr.reduce(function (memo: any, x: any) {
          if (!memo[x[property]]) {
            memo[x[property]] = [];
          }

          memo[x[property]].push(x);
          return memo;
        }, {});
      }

      client?.contacts_id.forEach(async (contact: any) => {
        const mailOptions = {
          to: contact.email,
          from: user?.email,
          subject: 'Escalation Email',
          html: htmlTemplate,
        };

        this.mailerService.add(MAILER_QUEUE, mailOptions);

        const mail_body = {
          contact_id: contact._id,
          compliance_id: complianceData._id,
          vendor_id: complianceData.vendor_id,
          project_id: complianceData.project_id,
          client_id: client._id,
          escalation_id: escalation._id,
          subject: 'Escalation Email',
          body: htmlTemplate,
          communication_type: COMMUNICATION_TYPE.ESCALATION,
          recipient_type: COMMUNICATION_RECIPIENT_TYPE.CLIENT,
        };

        await this.communicationService.create(mail_body);
      });
    }
  }

  async checkDefieciency(
    items: ComplianceItems[] | TemplateItems[],
    coverage: string,
  ) {
    const expiryList = [];
    const uploadList = [];
    const statusList = [];
    for (const item of items) {
      const masterReqObj = item.master_requirement;
      if (item.master_requirement?.coverage_type_uuid === coverage) {
        if (item.document_name === '') {
          uploadList.push({
            coverage_name: masterReqObj?.coverage_type_name,
            description: masterReqObj?.requirement_description,
            document_name: masterReqObj?.document_type_name,
          });
        }

        if (
          item.expiry_date &&
          moment(item.expiry_date).isSameOrBefore(moment(), 'day')
        ) {
          expiryList.push({
            coverage_name: masterReqObj?.coverage_type_name,
            description: masterReqObj?.requirement_description,
            document_name: masterReqObj?.document_type_name,
          });
        }

        if (item.status === 'Y' || item.status === 'R') {
          statusList.push({
            coverage_name: masterReqObj?.coverage_type_name,
            description: masterReqObj?.requirement_description,
            document_name: masterReqObj?.document_type_name,
            status: item.status,
          });
        }
      }
    }

    return {
      expiryList,
      uploadList,
      statusList,
    };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<unknown>) {
    this.logger.log(`The Escalation Job was completed: ${job.id}`);
  }
}

interface EscalationData {
  document_name: string;
  description: string;
  status: string;
}
