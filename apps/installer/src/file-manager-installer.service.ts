import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { ComplianceUpdate } from 'als/building-block/RequestableDto/Compliance/ComplianceUpdate';
import { fileExists } from 'als/building-block/utils/uploadHelpers';
import { IAssignProjectService } from 'als/manager/assign-project/assign-project.service';
import {
  ComplianceItems,
  TemplateItems,
} from 'als/manager/compliance/model/compliance.model';
import { IComplianceService } from 'als/manager/compliance/services/compliance.service';
import { IContactService } from 'als/manager/contact/contact.service';
import { IDocumentUploadService } from 'als/manager/document-upload/document-upload.service';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as util from 'util';

@Injectable()
export class FileManagerInstaller {
  // private templateService: ITemplateService,
  constructor(
    private complianceService: IComplianceService,
    private assignProjectService: IAssignProjectService,
    private documentUploadService: IDocumentUploadService,
    private contactService: IContactService,
  ) {}

  async uploadFile() {
    try {
      // const copyFile = util.promisify(fs.copyFile);
      const filename = 'd117cf50-11bb-4d6c-a404-8eb86062a693.pdf';
      // const sourceFile = `../installerData/${filename}`;
      // const destinationFile = `${path.join(
      //   path.dirname(process.cwd()),
      //   '../uploads',
      // )}/${filename}`;

      // if (!fileExists(destinationFile)) {
      //   await copyFile(sourceFile, destinationFile);
      //   Logger.log('FILE TRANSFER IN UPLOADS');
      // } else {
      //   Logger.log('FILE ALREADY EXIST IN UPLOADS');
      // }

      return {
        original_filename: 'sample.pdf',
        file_name: filename,
      };
    } catch (e) {}
  }

  async installFileManagerData() {
    Logger.warn('[-] SEEDING FILE MANAGER DATA!');
    try {
      const fileUploadResult = await this.uploadFile();
      const res = await this.documentUploadService.getAll();

      if (res.data.length > 0) {
        Logger.log(`[-] RECORDS ALREADY EXIST IN DATABASE!`);
        return;
      }

      const contacts = await this.contactService.getAll();
      if (contacts.data.length <= 0) {
        Logger.log(`[-] SEED CONTACTS FIRST!`);
        return;
      }

      if (!fileUploadResult) {
        Logger.error('{-} ERROR: FILE IS NOT FOUND! ');
        return;
      }

      // get all compliances
      const compliances = await this.complianceService.getAll();

      if (compliances.data.length < 0) {
        Logger.log('[-] KINDLY SEED THE COMPLIANCE DATA FIRST!');
        return;
      }

      let allComplianceItems: (ComplianceItems & {
        compliance_id: string;
      })[] = [];

      let allTemplateItems: (TemplateItems & {
        compliance_id: string;
      })[] = [];

      // prepare data
      compliances.data.forEach(el => {
        allComplianceItems = allComplianceItems.concat(
          el.compliance_items.map(el2 => ({
            ...JSON.parse(JSON.stringify(el2)),
            compliance_id: el._id,
          })),
        );

        allTemplateItems = allTemplateItems.concat(
          el.template_items.map(el2 => ({
            ...JSON.parse(JSON.stringify(el2)),
            compliance_id: el._id,
          })),
        );
      });

      // filter unique items
      allComplianceItems = _.uniqBy(allComplianceItems, 'document_type_uuid');
      allTemplateItems = _.uniqBy(allTemplateItems, 'document_type_uuid');

      // for unique compliance items
      if (allComplianceItems.length > 0) {
        for (const item of allComplianceItems) {
          const contactId = faker.helpers.arrayElement(contacts.data);
          const payload: ComplianceUpdate = {
            file_name: fileUploadResult.file_name,
            item_type: 'compliance',
            item_id: item._id,
            original_filename: fileUploadResult.original_filename,
          };

          Logger.log(
            `[-] uploading document against ${payload.item_type}_id: ${payload.item_id}`,
          );
          await this.complianceService.update(
            item.compliance_id,
            payload,
            contactId._id,
          );
        }
      }

      // for unique template items
      if (allTemplateItems.length > 0) {
        for (const item of allTemplateItems) {
          const contactId = faker.helpers.arrayElement(contacts.data);
          const payload: ComplianceUpdate = {
            file_name: fileUploadResult.file_name,
            item_type: 'template',
            item_id: item._id,
            original_filename: fileUploadResult.original_filename,
          };

          Logger.log(
            `[-] uploading document against ${payload.item_type}_id: ${payload.item_id}`,
          );

          await this.complianceService.update(
            item.compliance_id,
            payload,
            contactId._id,
          );
        }
      }

      Logger.warn('[-] FILE MANAGER DATA SEEDED!');
    } catch (e) {
      Logger.log(`ERROR WHILE SEEDING FILE MANAGER DATA: ${e.message}`);
    }
  }

  async dropFileManagerData() {
    try {
      Logger.warn('[-] DROPPING FILE MANAGER DATA COLLECTION');
      await this.documentUploadService.deleteAll();
      Logger.warn('[-] FILE MANAGER COLLECTION DROPPED');
    } catch (e) {}
  }
}
