import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { coverageTypeInstallerData } from 'als/building-block/installerData/coverageTypeInstallerData';
import { documentCategoryInstallerData } from 'als/building-block/installerData/documentCategoryInstallerData';
import { documentTypeInstallerData } from 'als/building-block/installerData/documentTypeInstallerData';
import { masterRequirementInstallerData } from 'als/building-block/installerData/masterRequirementInstallerData';
import {
  CoverageTypeManagerService,
  DocumentCategoryManagerService,
  DocumentTypeManagerService,
  MasterRequirementManagerService,
} from 'als/manager';

@Injectable()
export class MasterRequirementListInstallerService {
  constructor(
    private coverageTypeManagerService: CoverageTypeManagerService,
    private documentCategoryManagerService: DocumentCategoryManagerService,
    private documentTypeManagerService: DocumentTypeManagerService,
    private masterRequirementManagerService: MasterRequirementManagerService,
  ) {}

  async dropMasterRequirementDataCollection() {
    try {
      Logger.warn('[-] DROPING MASTER REQUIREMENT DATA COLLECTIONS');
      await this.coverageTypeManagerService.CoverageTypeModel.deleteMany();
      await this.documentCategoryManagerService.DocumentCategoryModel.deleteMany();
      await this.documentTypeManagerService.DocumentTypeModel.deleteMany();
      await this.masterRequirementManagerService.MasterRequirementModel.deleteMany();
      Logger.warn('[-] MASTER REQUIREMENT DATA COLLECTIONS DROPPED');
    } catch (e) {
      Logger.error('Error while droping master requirement data collection', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async installMasterRequirementList() {
    const session =
      await this.masterRequirementManagerService.MasterRequirementModel.db.startSession();

    session.startTransaction();

    try {
      const masterRequirementList =
        await this.masterRequirementManagerService.getAll();

      if (masterRequirementList && masterRequirementList.data.length > 0) {
        Logger.warn('[-] Aborting Seeding!');
        await session.abortTransaction();
        Logger.warn('[-] MASTER REQUIREMENT LIST ALREADY EXIST IN DATABASE!');
        return;
      }

      Logger.warn('[-] SEEDING MASTER REQUIREMENT LIST DATA!');

      // Coverage Type
      const coverageTypes = coverageTypeInstallerData.map(
        async coverageType => {
          const coverage =
            new this.coverageTypeManagerService.CoverageTypeModel(coverageType);

          await coverage.save({ session });
        },
      );

      await Promise.all(coverageTypes);
      Logger.log('[-] Coverage Type created !');

      // Document Category:
      const documentCategories = documentCategoryInstallerData.map(
        async documentCategory => {
          const docCategory =
            new this.documentCategoryManagerService.DocumentCategoryModel(
              documentCategory,
            );

          await docCategory.save({ session });
        },
      );

      await Promise.all(documentCategories);
      Logger.log('[-] Document Categoreis created !');

      // Document type:
      const documentTypes = documentTypeInstallerData.map(
        async documentType => {
          const docType = new this.documentTypeManagerService.DocumentTypeModel(
            documentType,
          );

          await docType.save({ session });
        },
      );

      await Promise.all(documentTypes);
      Logger.log('[-] Document Types created !');

      // Master Requirement
      const masterRequirements = masterRequirementInstallerData.map(
        async masterRequirement => {
          const masterReq =
            new this.masterRequirementManagerService.MasterRequirementModel(
              masterRequirement,
            );

          await masterReq.save({ session });
        },
      );

      await Promise.all(masterRequirements);
      // Commit the transaction
      await session.commitTransaction();
      Logger.warn('[-] MASTER REQUIREMENT LIST SEEDED!');
    } catch (error) {
      // Abort the transaction
      await session.abortTransaction();
      Logger.error('Error while seeding master requirement list', error);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    } finally {
      await session.endSession();
    }
  }
}
