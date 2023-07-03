import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagerModule } from 'als/manager';
import { CommandModule } from 'nestjs-command';

import { CommandService } from './commandService';
import { MasterRequirementListInstallerService } from './master-requirement-list-installer.service';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_URL}`),
    ManagerModule,
    CommandModule,
  ],
  providers: [CommandService, MasterRequirementListInstallerService],
})
export class SeederModule {}
