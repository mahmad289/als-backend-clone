import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { coverageTypeInstallerData } from 'als/building-block/installerData/coverageTypeInstallerData';
import { documentCategoryInstallerData } from 'als/building-block/installerData/documentCategoryInstallerData';
import { documentTypeInstallerData } from 'als/building-block/installerData/documentTypeInstallerData';
import { masterRequirementInstallerData } from 'als/building-block/installerData/masterRequirementInstallerData';
import { CoverageTypeCreator } from 'als/building-block/RequestableDto/CoverageType/CoverageTypeCreator';
import { DocumentCategoryCreator } from 'als/building-block/RequestableDto/DocumentCategory/DocumentCategoryCreator';
import { DocumentTypeCreator } from 'als/building-block/RequestableDto/DocumentType/DocumentTypeCreator';
import { MasterRequirementCreator } from 'als/building-block/RequestableDto/MasterRequirement/MasterRequirementCreator';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { ICoverageTypeService } from 'als/manager/requirement-group/interfaces/coverage-type.service';
import { IDocumentCategoryService } from 'als/manager/requirement-group/interfaces/document-category.service';
import { IDocumentTypeService } from 'als/manager/requirement-group/interfaces/document-type.service';
import { IMasterRequirementService } from 'als/manager/requirement-group/interfaces/master-requirement.service';

@Injectable()
export class MasterRequirementListInstallerService {
  constructor(
    private documentTypeService: IDocumentTypeService,
    private masterRequirementService: IMasterRequirementService,
    private coverageTypeService: ICoverageTypeService,
    private documentCategoryService: IDocumentCategoryService,
  ) {
    initWinston('logs');
  }

  //* createCoverageType
  async createCoverageType(coverageTypeData: CoverageTypeCreator[]) {
    for (const coverageType of coverageTypeData) {
      try {
        const coverageTypeResponse = await this.coverageTypeService.create(
          coverageType,
        );

        Logger.log(`coverageType created with id: ${coverageTypeResponse._id}`);
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating Coverage Type, ${error.message}`);
      }
    }
  }

  //* createDocumentCategory
  async createDocumentCategory(
    documentCategoryData: DocumentCategoryCreator[],
  ) {
    for (const documentCategory of documentCategoryData) {
      try {
        const documentCategoryResponse =
          await this.documentCategoryService.create(documentCategory);

        Logger.log(
          `DocumentCategory created with id: ${documentCategoryResponse._id}`,
        );
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating Document Category, ${error.message}`);
      }
    }
  }

  //* createDocumentType
  async createDocumentType(documentTypeData: DocumentTypeCreator[]) {
    for (const documentType of documentTypeData) {
      try {
        const documentTypeResponse = await this.documentTypeService.create(
          documentType,
        );

        Logger.log(`DocumentType created with id: ${documentTypeResponse._id}`);
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating Document Type, ${error.message}`);
      }
    }
  }

  //* createMasterRequirement
  async createMasterRequirement(
    masterRequirementData: MasterRequirementCreator[],
  ) {
    for (const masterRequirement of masterRequirementData) {
      try {
        const masterRequirementResponse =
          await this.masterRequirementService.create(masterRequirement);

        Logger.log(
          `MasterRequirement created with id: ${masterRequirementResponse._id}`,
        );
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating Master Requirement, ${error.message}`);
      }
    }
  }

  async dropMasterRequirementDataCollection() {
    try {
      Logger.warn('[-] DROPING MASTER REQUIREMENT DATA COLLECTIONS');
      await Promise.all([
        this.coverageTypeService.deleteAll(),
        this.documentCategoryService.deleteAll(),
        this.documentTypeService.deleteAll(),
        this.masterRequirementService.deleteAll(),
      ]);

      Logger.warn('[-] MASTER REQUIREMENT DATA COLLECTIONS DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while droping master requirement data collection', e);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async checkInsertedData() {
    try {
      const coverageTypeCreated = await this.coverageTypeService.getAll();

      Logger.log(`CoverageTypeCreated created: ${coverageTypeCreated?.total}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Coverage Types: ${error.message}`);
    }

    try {
      const documentCategory = await this.documentCategoryService.getAll();

      Logger.log(`DocumentCategory created: ${documentCategory?.total}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Document Categories: ${error.message}`);
    }

    try {
      const documentType = await this.documentTypeService.getAll();
      Logger.log(`DocumentType created: ${documentType?.data.length}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Document Types: ${error.message}`);
    }

    try {
      const masterRequirement = await this.masterRequirementService.getAll();

      Logger.log(
        `MasterRequirement created: ${masterRequirement?.data.length}`,
      );
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Master Requirements: ${error.message}`);
    }
  }

  async installMasterRequirementList() {
    try {
      const masterRequirementList =
        await this.masterRequirementService.getAll();

      if (
        masterRequirementList?.data.length &&
        masterRequirementList?.data.length > 0
      ) {
        Logger.warn('[-] MASTER REQUIREMENT LIST ALREADY EXIST IN DATABASE!');
        return;
      } else {
        Logger.warn('[-] SEEDING MASTER REQUIREMENT LIST DATA!');

        await Promise.all([
          this.createCoverageType(coverageTypeInstallerData),
          this.createDocumentCategory(documentCategoryInstallerData),
          this.createDocumentType(documentTypeInstallerData),
          this.createMasterRequirement(masterRequirementInstallerData),
        ]);

        await this.checkInsertedData();

        Logger.warn('[-] MASTER REQUIREMENT LIST SEEDED!');
      }
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.error('Error while seeding master requirement list', error);
      throw new HttpException('Some thing went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
