import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { AutoNotificationInstallerService } from './auto-notification-installer.service';
import { CommunicationTemplateDataInstallerService } from './communication-template-installer.service';
import { FileManagerInstaller } from './file-manager-installer.service';
import { InstallerService } from './installer.service';
import { MasterDataInstallerService } from './master-data-installer.service';
import { MasterRequirementListInstallerService } from './master-requirement-list-installer.service';
import { ProjectInstallerService } from './project-installer.service';
import { RequirementsInstallerService } from './requirement-installer.service';
import { TagsInstallerService } from './tag-manager-Installer.service';
import { TemplateInstallerService } from './template-installer.service';

@Injectable()
export class CommandService {
  constructor(
    private masterDataInstallerService: MasterDataInstallerService,
    private masterRequirementListInstallerService: MasterRequirementListInstallerService,
    private requirementsInstallerService: RequirementsInstallerService,
    private communicationTemplateDataInstallerService: CommunicationTemplateDataInstallerService,
    private projectInstallerService: ProjectInstallerService,
    private templateInstallerService: TemplateInstallerService,
    private autoNoticationInstallerService: AutoNotificationInstallerService,
    private installerService: InstallerService,
    private fileManagerInstaller: FileManagerInstaller,
    private tagsInstallerService: TagsInstallerService,
  ) {}
  @Command({
    command: 'run:install-master-data',
    describe: 'you can use this command to seed database',
  })
  async seed() {
    await this.masterDataInstallerService.installMasterData();
  }
  @Command({
    command: 'run:clear-master-data',
    describe: 'you can use this command to clear database',
  })
  async dropMasterDataCollection() {
    await this.masterDataInstallerService.dropMasterDataCollection();
  }

  @Command({
    command: 'run:install-uat-master-data',
  })
  async installUATMasterData() {
    await this.masterDataInstallerService.installUATMasterData();
  }

  @Command({
    command: 'run:clear-uat-master-data',
  })
  async dropUATMasterDataCollection() {
    await this.masterDataInstallerService.dropUATMasterDataCollection();
  }

  @Command({
    command: 'run:install-master-requirement-data',
    describe:
      'you can use this command to populate master requirement list in database!',
  })
  async installMasterRequirement() {
    await this.masterRequirementListInstallerService.installMasterRequirementList();
  }

  @Command({
    command: 'run:clear-master-requirement-data',
    describe:
      'you can use this command to populate master requirement list in database!',
  })
  async dropMasterRequirement() {
    await this.masterRequirementListInstallerService.dropMasterRequirementDataCollection();
  }

  @Command({
    command: 'run:clear-database',
    describe: 'you can use this command to drop whole database!',
  })
  async dropDatabase() {
    await this.masterDataInstallerService.dropDatabase();
  }
  @Command({
    command: 'run:install-requirements',
    describe: 'you can use this command to insert requirement in database!',
  })
  async installRequirement() {
    await this.requirementsInstallerService.installRequirements();
  }
  @Command({
    command: 'run:clear-requirements',
    describe: 'you can use this command to drop the requirement database!',
  })
  async dropRequirementGroup() {
    await this.requirementsInstallerService.dropRequirementDataCollection();
  }

  @Command({
    command: 'run:install-project-data',
    describe: 'you can use this command to insert project data in database!',
  })
  async installProjectData() {
    await this.projectInstallerService.installProjectData();
  }
  @Command({
    command: 'run:clear-project-data',
    describe: 'you can use this command to drop the project database!',
  })
  async dropProjectData() {
    await this.projectInstallerService.dropProjectDataCollection();
  }
  @Command({
    command: 'run:install-template',
    describe: 'you can use this command to install the template in database!',
  })
  async installTemplate() {
    await this.templateInstallerService.installTemplate();
  }
  @Command({
    command: 'run:clear-template',
    describe: 'you can use this command to drop the template in database!',
  })
  async clearTemplate() {
    await this.templateInstallerService.dropTemplate();
  }

  @Command({
    command: 'run:install-complete-data',
    describe: 'you can use this command install the complete data in database',
  })
  async installWholeData() {
    await this.installerService.installDatabase();
  }

  @Command({
    command: 'run:install-communication-template-data',
    describe:
      'you can use this command to insert communication templates collection in database!',
  })
  async installCommunicationTemplateData() {
    await this.communicationTemplateDataInstallerService.installCommunicationTemplateData();
  }

  @Command({
    command: 'run:clear-communication-template-data',
    describe:
      'you can use this command to drop the communication templates collection from database!',
  })
  async dropCommunicationTemplateData() {
    await this.communicationTemplateDataInstallerService.dropCommunicationTemplateDataCollection();
  }

  @Command({
    command: 'run:install-auto-notification-data',
    describe:
      'you can use this command to insert auto notification data in database!',
  })
  async installAutoNotificationData() {
    await this.autoNoticationInstallerService.installAutoNotificationData();
  }

  @Command({
    command: 'run:clear-auto-notification-data',
    describe:
      'you can use this command to drop the auto notification data in database!',
  })
  async clearAutoNotificationData() {
    await this.autoNoticationInstallerService.dropAutoNotificationDataCollection();
  }
  // file manager installer
  @Command({
    command: 'run:install-file-manager-data',
    describe:
      'you can use this command to install the file manager data in  database!',
  })
  async installFileMangerData() {
    await this.fileManagerInstaller.installFileManagerData();
  }

  @Command({
    command: 'run:clear-file-manager-data',
    describe:
      'you can use this command to drop the document upload  collection from database!',
  })
  async dropFileMangerData() {
    await this.fileManagerInstaller.dropFileManagerData();
  }

  // tags Installer
  @Command({
    command: 'run:install-tags-manager-data',
    describe:
      'you can use this command to install the tags manager data in  database!',
  })
  async installTagsData() {
    await this.tagsInstallerService.installTagData();
  }

  @Command({
    command: 'run:clear-tags-manager-data',
    describe:
      'you can use this command to drop the tags collection from database!',
  })
  async dropTagsData() {
    await this.tagsInstallerService.dropTagsDataCollection();
  }
}
