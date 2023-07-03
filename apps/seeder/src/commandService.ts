import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { MasterRequirementListInstallerService } from './master-requirement-list-installer.service';

@Injectable()
export class CommandService {
  constructor(
    private masterRequirementListInstallerService: MasterRequirementListInstallerService,
  ) {}

  @Command({
    command: 'run:install-master-requirement-data',
    describe: 'you can use this command to seed database',
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
}
