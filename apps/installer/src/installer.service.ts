import { Injectable, Logger } from '@nestjs/common';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';

import { AutoNotificationInstallerService } from './auto-notification-installer.service';
import { CommunicationTemplateDataInstallerService } from './communication-template-installer.service';
import { FileManagerInstaller } from './file-manager-installer.service';
import { MasterDataInstallerService } from './master-data-installer.service';
import { MasterRequirementListInstallerService } from './master-requirement-list-installer.service';
import { ProjectInstallerService } from './project-installer.service';
import { RequirementsInstallerService } from './requirement-installer.service';
import { TagsInstallerService } from './tag-manager-Installer.service';
import { TemplateInstallerService } from './template-installer.service';

@Injectable()
export class InstallerService {
  constructor(
    private masterDataInstallerService: MasterDataInstallerService,
    private masterRequirementListInstallerService: MasterRequirementListInstallerService,
    private requirementsInstallerService: RequirementsInstallerService,
    private communicationTemplateDataInstallerService: CommunicationTemplateDataInstallerService,
    private projectInstallerService: ProjectInstallerService,
    private templateInstallerService: TemplateInstallerService,
    private autoNotificationInstallerService: AutoNotificationInstallerService,
    private fileManagerService: FileManagerInstaller,
    private tagsInstallerService: TagsInstallerService,
  ) {
    initWinston('logs');
  }
  async installDatabase() {
    try {
      Logger.log('Installing Database');

      // install tags manager data
      await this.tagsInstallerService.installTagData();

      // installing master data
      await this.masterDataInstallerService.installMasterData();

      // installing master requirements data
      await this.masterRequirementListInstallerService.installMasterRequirementList();

      // installing templates
      await this.templateInstallerService.installTemplate();

      // install requirements
      await this.requirementsInstallerService.installRequirements();

      // installing project data
      await this.projectInstallerService.installProjectData();

      // installing communication template data
      await this.communicationTemplateDataInstallerService.installCommunicationTemplateData();

      // installing auto notification data
      await this.autoNotificationInstallerService.installAutoNotificationData();
      // install file manager data
      await this.fileManagerService.installFileManagerData();

      Logger.log('Database Installed');
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Some Data While Seeding May Have Failed: ${error.message}`);
    }
  }
}
