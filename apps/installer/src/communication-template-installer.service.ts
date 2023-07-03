import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { communicationTemplatesData } from 'als/building-block/installerData/communicationTemplateData';
import { CommunicationTemplateCreator } from 'als/building-block/RequestableDto/CommunicationTemplate/CommunicationTemplateCreator';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { CommunicationTemplateManagerService } from 'als/manager';
import {
  templateEntities,
  templateTypes,
} from 'als/manager/email-templates/config/config';
import { IUserService } from 'als/manager/user/user.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommunicationTemplateDataInstallerService {
  constructor(
    private communicationTemplateManagerService: CommunicationTemplateManagerService,
    private userService: IUserService,
  ) {
    initWinston('logs');
  }

  async dropCommunicationTemplateDataCollection() {
    try {
      Logger.warn('[-] DROPING COMMUNICATION DATA COLLECTIONS');
      await this.communicationTemplateManagerService.communicationTemplateModel.deleteMany();
      Logger.warn('[-] COMMUNICATION DATA COLLECTIONS DROPPED!');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while droping communication data collections', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
  async createCommunicationTemplate(
    communicationTemplateData: CommunicationTemplateCreator,
  ) {
    try {
      await this.communicationTemplateManagerService.create(
        communicationTemplateData,
      );
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.log(`Error: ${e}`);
    }
  }

  async checkInsertedData() {
    const communicationTemplateCreated =
      await this.communicationTemplateManagerService.getAll();

    Logger.log(
      `Communication Template data created: ${communicationTemplateCreated?.total}`,
    );
  }

  async dropDatabase() {
    try {
      Logger.warn('[-] DROPING WHOLE DATABASE');
      await this.communicationTemplateManagerService.communicationTemplateModel.db.dropDatabase();
      Logger.warn('[-] WHOLE DATABASE DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while droping whole database', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async installCommunicationTemplateData() {
    try {
      const communicationTemplateData =
        await this.communicationTemplateManagerService.getAll();

      if (
        communicationTemplateData?.data.length &&
        communicationTemplateData?.data.length > 0
      ) {
        Logger.warn('[-] RECORDS ALREADY EXIST IN DATABASE!');
        return;
      } else {
        Logger.warn('[-] SEEDING COMMUNICATION TEMPLATE DATA!');

        for (const template of communicationTemplatesData) {
          const matchingType = templateTypes.find(
            el => el.type === template.template_type,
          );

          if (matchingType) {
            const matchingEntities = templateEntities.filter(entity =>
              matchingType.entities.includes(entity.entity_type),
            );

            const alsUserCreated = await this.userService.getAll();
            const userIds = alsUserCreated.data.map(el => el._id);
            const create_by_id = faker.helpers.arrayElement(userIds);
            template.created_by = new ObjectId(create_by_id);
            const updatedTemplate = { ...template, tags: matchingEntities };
            await this.createCommunicationTemplate(updatedTemplate);
          }
        }

        await this.checkInsertedData();
        Logger.warn('[-] COMMUNICATION TEMPLATE DATA SEEDED!');
        return 'Installer data seeded!';
      }
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while seeding data', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
