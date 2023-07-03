import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AutoNotificationCreator } from 'als/building-block/RequestableDto/AutoNotification/AutoNotificationCreator';
import { CommunicationTemplatePartialResponseDto } from 'als/building-block/TransferableDto/CommunicationTemplate/CommuniccationTemplatePartial';
import {
  createAutoNotifications,
  createAutoNotificationsRequest,
  createAutoNotificationsUpdate,
} from 'als/building-block/utils/fakeData';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { IAutoNotificationService } from 'als/manager/auto-notification/auto-notification.service';
import { ICommunicationTemplateService } from 'als/manager/communication-template/communication-template.service';
import { IProjectService } from 'als/manager/project/project-service';
import { IDocumentTypeService } from 'als/manager/requirement-group/interfaces/document-type.service';
import { ITagService } from 'als/manager/tag/tag.service';
import { IUserService } from 'als/manager/user/user.service';

@Injectable()
export class AutoNotificationInstallerService {
  constructor(
    private autoNotificationService: IAutoNotificationService,
    private communicationTemplateService: ICommunicationTemplateService,
    private userService: IUserService,
    private tagsService: ITagService,
    private documentTypeService: IDocumentTypeService,
    private projectServices: IProjectService,
  ) {
    initWinston('logs');
  }

  async createAutoNotification(
    autoNotificationtData: AutoNotificationCreator[],
  ) {
    const userList = await this.userService.getAll();
    const communicationTemplate =
      await this.communicationTemplateService.getAll();

    const projectList = await this.projectServices.getAll();
    const communicationTemplateList: CommunicationTemplatePartialResponseDto[] =
      [];

    communicationTemplate.data.forEach(t => {
      if (
        t.template_type === 'AutoNotification Update' ||
        t.template_type === 'AutoNotification Request'
      ) {
        communicationTemplateList.push(t);
      }
    });

    const documentTypeList = await this.documentTypeService.getAll();
    const tagsData = await this.tagsService.findAll();

    for (const autoNotification of autoNotificationtData) {
      // console.log("This is autoNotificationtData", autoNotificationtData);
      try {
        const autoNotificationUpdateResponse =
          await this.autoNotificationService.create({
            ...autoNotification,
            type: 'update',
          });

        const autoNotificationRequestResponse =
          await this.autoNotificationService.create({
            ...autoNotification,
            type: 'request',
          });

        const autoNotificationUpdate = createAutoNotificationsUpdate(
          userList.data,
          communicationTemplateList,
          documentTypeList.data,
          tagsData,
          projectList.data,
        );

        const autoNotificationRequest = createAutoNotificationsRequest(
          userList.data,
          communicationTemplateList,
          tagsData,
          projectList.data,
        );

        await this.autoNotificationService.update(
          autoNotificationUpdateResponse._id.toString(),
          autoNotificationUpdate,
        );

        await this.autoNotificationService.update(
          autoNotificationRequestResponse._id.toString(),
          autoNotificationRequest,
        );

        Logger.log(
          `Auto Notification created with id: ${autoNotificationUpdateResponse._id}`,
        );
        Logger.log(
          `Auto Notification created with id: ${autoNotificationRequestResponse._id}`,
        );
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating Auto Notification, ${error.message}`);
      }
    }
  }

  async dropAutoNotificationDataCollection() {
    try {
      Logger.warn('[-] DROPING AUTO NOTIFICATION DATA COLLECTIONS');
      await this.autoNotificationService.deleteAll();
      Logger.warn('[-] AUTO NOTIFICATION COLLECTION DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while droping auto notification data collection', e);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async checkInsertedData() {
    try {
      const autoNotificationCreated =
        await this.autoNotificationService.getAll();

      Logger.log(
        `Auto Notifications created: ${autoNotificationCreated?.total}`,
      );
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Auto Notifications: ${error.message}`);
    }
  }

  async installAutoNotificationData() {
    try {
      const userList = await this.userService.getAll();
      const communicationTemplateList =
        await this.communicationTemplateService.getAll();

      const tagsData = await this.tagsService.findAll();
      const autoNotificationList = await this.autoNotificationService.getAll();

      if (
        userList.data.length < 1 ||
        communicationTemplateList.data.length < 1 ||
        tagsData.length < 1
      ) {
        Logger.warn('[-] ONE OF THE FOLLOWING IS MISSING!');

        Logger.warn('[-] USER DATA!');
        Logger.warn('[-] COMMUNICATION TEMPLATE DATA!');
        Logger.warn('[-] TAG DATA!');
        return;
      }

      if (autoNotificationList.data.length > 0) {
        Logger.warn('[-] AUTO NOTIFICATION DATA ALREADY EXIST IN DATABASE!');
        return;
      }

      Logger.warn('[-] SEEDING AUTO NOTIFICATION DATA!');

      const autoNotificationData = createAutoNotifications(10);

      await this.createAutoNotification(autoNotificationData);

      Logger.warn('[-] AUTO NOTIFICATION DATA SEEDED!');
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.error('Error while seeding auto notification data', error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
