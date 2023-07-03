import { Module } from '@nestjs/common';

import { BuildingBlockService } from './building-block.service';

@Module({
  providers: [BuildingBlockService],
  exports: [BuildingBlockService],
})
export class BuildingBlockModule {}
