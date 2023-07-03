import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TemplateCompleteResponseDto } from 'als/building-block/TransferableDto/Template/Template';
import { createCoiTemplateData } from 'als/building-block/utils/fakeData';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { IMasterRequirementService } from 'als/manager/requirement-group/interfaces/master-requirement.service';
import { ITemplateService } from 'als/manager/requirement-group/interfaces/template.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class TemplateInstallerService {
  constructor(
    private templateService: ITemplateService,
    private masterRequirementService: IMasterRequirementService,
  ) {
    initWinston('logs');
  }

  //* create COI Template

  async createTemplate(
    numberOfTemplate: number,
    templateType: 'acord25' | 'acord28',
  ) {
    const coiRequirement = await this.masterRequirementService.find({
      document_type_name: templateType,
    });

    const reqList: ObjectId[] = coiRequirement.data.map(r => r._id);
    const data = createCoiTemplateData(numberOfTemplate, reqList, templateType);
    // return await this.createTemplate(data);
    const result: TemplateCompleteResponseDto[] = [];
    for (const template of data) {
      const res = await this.templateService.create(template);
      result.push(res);
      Logger.log(`{-} template ${res.type} created with id: ${res._id}`);
    }

    return result;
  }

  async dropTemplate() {
    try {
      Logger.warn('[-] DROPPING TEMPLATE DATA COLLECTIONS');
      await this.templateService.deleteAll();
      Logger.warn('[-] TEMPLATE DATA COLLECTIONS DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while dropping template data collection', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async installTemplate() {
    try {
      // have to check master req exist or not!
      const masterReqExist = await this.masterRequirementService.find({});

      if (masterReqExist.data && masterReqExist.data.length < 1) {
        Logger.warn(
          '[-] KINDLY SEED THE MASTER REQUIREMENT DATA FIRST IN THE DATABASE!',
        );
        return false;
      } else {
        const templates = await this.templateService.find({});

        if (templates && templates.length > 0) {
          Logger.warn('[-] TEMPLATE ALREADY EXIST IN DATABASE!');
          return templates;
        } else {
          const res = await this.createTemplate(20, 'acord25');
          const res1 = await this.createTemplate(20, 'acord28');
          Logger.warn(`[-] TEMPLATE CREATED!`);
          return [...res, ...res1];
        }
      }
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.error('Error while seeding template', error);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
