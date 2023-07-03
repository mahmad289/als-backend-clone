import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { userInstallerData } from 'als/building-block/installerData/userInstallerData';
import { ProjectCreator } from 'als/building-block/RequestableDto/Project/ProjectCreator';
import { ProjectPartialResponseDTO } from 'als/building-block/TransferableDto/Project/ProjectPartial';
import { RequirementsPartialResponseDto } from 'als/building-block/TransferableDto/Requirements/RequirementsPartial';
import { CONTACT_TYPE_CATEGORY_ENUM } from 'als/building-block/utils/enum';
import {
  createProjects,
  createProjectUpdate,
  IAssignedVendor,
} from 'als/building-block/utils/fakeData';
import {
  initWinston,
  winstonLogger,
} from 'als/building-block/utils/winstonLogger';
import { IClientService } from 'als/manager/client/client.service';
import { IContactService } from 'als/manager/contact/contact.service';
import { IProjectService } from 'als/manager/project/project-service';
import { IRequirementService } from 'als/manager/requirement-group/interfaces/requirements.service';
import { RequirementsModel } from 'als/manager/requirement-group/model/requirements.model';
import { ITagService } from 'als/manager/tag/tag.service';
import { IUserService } from 'als/manager/user/user.service';
import { VendorModel } from 'als/manager/vendor/vendor.model';
import { IVendorService } from 'als/manager/vendor/vendor.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProjectInstallerService {
  constructor(
    private contactService: IContactService,
    private clientService: IClientService,
    private vendorService: IVendorService,
    private projectService: IProjectService,
    private requirementService: IRequirementService,
    private userService: IUserService,
    private tagService: ITagService,
  ) {
    initWinston('logs');
  }

  // createProjectData for updating DB data
  async createProjectData(
    vendor: VendorModel[],
    requirementGroup: RequirementsPartialResponseDto[],
    project: ProjectPartialResponseDTO,
  ) {
    try {
      const assignedVendor: IAssignedVendor[] = [];
      const rnd = Math.floor(Math.random() * (8 - 3 + 1) + 3);
      const vendorArray = faker.helpers.uniqueArray(vendor, rnd);
      const requirementArray = faker.helpers.uniqueArray(requirementGroup, rnd);
      vendorArray.forEach((vendor, index) => {
        assignedVendor.push({
          vendor_id: vendor._id,
          vendor_name: vendor.vendor_name,
          requirement_group_id: requirementArray[index]._id,
          requirement_group_name: requirementArray[index].name,
        });
      });

      const user = await this.userService.findOne({
        email: userInstallerData[0].email,
      });

      // here i need to pass contact array
      const contacts = await this.contactService.find({
        contact_type: CONTACT_TYPE_CATEGORY_ENUM.PROJECT,
      });

      const Ids = contacts.map(el => el._id);
      const contactArray = faker.helpers.uniqueArray(Ids, rnd);
      const projectData = createProjectUpdate();
      await this.projectService.update(project._id.toString(), projectData);
      for (const vendor of assignedVendor) {
        await this.projectService.addVendorAssignment(
          project._id.toString(),
          vendor,
          {
            userId: user?._id as unknown as ObjectId,
            role: user?.role as unknown as string,
          },
        );
      }

      for (const contact of contactArray) {
        await this.projectService.contactAssignment(project._id.toString(), {
          _id: contact,
        });
      }
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while updating project data', e.message);
    }
  }

  //* createProject and Update
  async createProject(projectData: ProjectCreator[], tagIds: ObjectId[]) {
    const vendor = await this.vendorService.getAll();
    const requirementGroup = await this.requirementService.getAll();
    for (const project of projectData) {
      try {
        project.tags = faker.helpers.arrayElements(tagIds, 3);
        const projectResponse = await this.projectService.create(project);

        await this.createProjectData(
          vendor.data,
          requirementGroup.data,
          projectResponse,
        );
        Logger.log(`Project created with id: ${projectResponse._id}`);
      } catch (error) {
        winstonLogger.errorLog.error(error.stack);
        Logger.log(`Error while creating project, ${error.message}`);
      }
    }
  }

  async dropProjectDataCollection() {
    try {
      Logger.warn('[-] DROPPING PROJECT DATA COLLECTIONS');
      await this.projectService.deleteAll();
      Logger.warn('[-] PROJECT COLLECTION DROPPED');
    } catch (e) {
      winstonLogger.errorLog.error(e.stack);
      Logger.error('Error while dropping project data collection', e);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async checkInsertedData() {
    try {
      const ProjectCreated = await this.projectService.getAll();

      Logger.log(`Projects created: ${ProjectCreated?.total}`);
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.log(`Unable to get Projects: ${error.message}`);
    }
  }

  async installProjectData() {
    try {
      const vendorList = await this.vendorService.getAll();
      const clientList = await this.clientService.getAll();
      const contactList = await this.contactService.getAll();
      const requirementList = await this.requirementService.getAll();
      const projectList = await this.projectService.getAll();
      const tagList = await this.tagService.findAll();

      // Start of Project Data Seeding
      if (
        vendorList.data.length < 1 ||
        clientList.data.length < 1 ||
        contactList.data.length < 1 ||
        requirementList.data.length < 1 ||
        tagList.length < 1
      ) {
        Logger.warn('[-] ONE OF THE FOLLOWING IS MISSING!');

        Logger.warn('[-] VENDOR DATA!');
        Logger.warn('[-] CLIENT DATA!');
        Logger.warn('[-] MANAGER DATA!');
        Logger.warn('[-] TAG DATA!');
        Logger.warn('[-] REQUIREMENT GROUP DATA!');
        return;
      }

      if (projectList.data.length > 0) {
        Logger.warn('[-] PROJECT DATA ALREADY EXIST IN DATABASE!');
        return;
      }

      Logger.warn('[-] SEEDING PROJECT DATA!');

      const client = await this.clientService.getAll();
      const contacts = await this.contactService.getAll();
      // get tags //
      const projectData = createProjects(30, client.data, contacts.data);
      await this.createProject(
        projectData,
        tagList.map(el => el._id),
      );

      await this.checkInsertedData();

      Logger.warn('[-] PROJECT DATA SEEDED!');

      // END OF PROJECT DATA SEEDING
    } catch (error) {
      winstonLogger.errorLog.error(error.stack);
      Logger.error('Error while seeding project data', error);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
