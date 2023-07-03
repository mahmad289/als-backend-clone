import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RequirementsCreator } from 'als/building-block/RequestableDto/Requirements/RequirementsCreator';
import { createRequirmentGroup } from 'als/building-block/utils/fakeReqGroup';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { IMasterRequirementService } from 'als/manager/requirement-group/interfaces/master-requirement.service';
import { IRequirementService } from 'als/manager/requirement-group/interfaces/requirements.service';
import { ITemplateService } from 'als/manager/requirement-group/interfaces/template.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class RequirementsInstallerService {
  constructor(
    private requirementService: IRequirementService,
    private masterRequirementService: IMasterRequirementService,
    private templateManagerService: ITemplateService,
  ) {
    initWinston('logs');
  }

  //* create Requirement
  async createRequirements(documentCategoryData: RequirementsCreator[]) {
    for (const documentRequirementGroup of documentCategoryData) {
      await this.requirementService.create(documentRequirementGroup);
    }
  }

  async dropRequirementDataCollection() {
    try {
      Logger.warn('[-] DROPING REQUIREMENTS DATA COLLECTIONS');
      await this.requirementService.deleteAll();
      Logger.warn('[-] REQUIREMENTS DATA COLLECTIONS DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while dropping requirements data collection', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async installRequirements() {
    try {
      const existingReqs = await this.requirementService.getAll();
      if (existingReqs.data && existingReqs.data.length > 0) {
        Logger.warn('[-] REQUIREMENTS ALREADY EXIST IN DATABASE!');
      } else {
        const masterReqExist = await this.masterRequirementService.find({});

        if (masterReqExist.data && masterReqExist.data.length < 1) {
          Logger.warn(
            '[-] KINDLY SEED THE MASTER REQUIREMENT DATA FIRST IN THE DATABASE!',
          );
          return false;
        }

        const templates = await this.templateManagerService.find({});
        if (templates && templates.length < 1) {
          Logger.warn(
            '[-] KINDLY SEED THE TEMPLATE DATA FIRST IN THE DATABASE!',
          );
          return false;
        }

        Logger.warn('[-] SEEDING REQUIREMENTS DATA!');
        let IdsArray: ObjectId[] = [];
        // put id of master requirement list group
        const listData = await this.masterRequirementService.getAll();

        // Acord 25 and Acord 28 dummy el has document_type_name : null, So Remove them!
        listData.data = listData.data.filter(
          el => el.document_type_name !== 'null',
        );

        IdsArray = listData.data.map(data => data._id);

        const reqGroupData = createRequirmentGroup(30, IdsArray, templates);

        await this.createRequirements(reqGroupData);
        Logger.warn(`[-]REQUIREMENTS LIST SEEDED!  - ${reqGroupData.length}`);
      }
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.error('Error while seeding  requirements', error);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
