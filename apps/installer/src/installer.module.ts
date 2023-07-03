import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagerModule } from 'als/manager';
import { CommandModule } from 'nestjs-command';

import { AutoNotificationInstallerService } from './auto-notification-installer.service';
import { CommandService } from './commandService';
import { CommunicationTemplateDataInstallerService } from './communication-template-installer.service';
import { FileManagerInstaller } from './file-manager-installer.service';
import { InstallerService } from './installer.service';
import { MasterDataInstallerService } from './master-data-installer.service';
import { MasterRequirementListInstallerService } from './master-requirement-list-installer.service';
import { ProjectInstallerService } from './project-installer.service';
import { RequirementsInstallerService } from './requirement-installer.service';
import { TagsInstallerService } from './tag-manager-Installer.service';
import { TemplateInstallerService } from './template-installer.service';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_URL}`),
    ManagerModule,
    CommandModule,
  ],
  providers: [
    MasterDataInstallerService,
    CommandService,
    MasterRequirementListInstallerService,
    RequirementsInstallerService,
    CommunicationTemplateDataInstallerService,
    TemplateInstallerService,
    ProjectInstallerService,
    AutoNotificationInstallerService,
    InstallerService,
    FileManagerInstaller,
    TagsInstallerService,
  ],
})
export class InstallerModule {}
