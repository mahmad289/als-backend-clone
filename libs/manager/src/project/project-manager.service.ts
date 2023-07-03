import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAssignedToRequest } from 'als/auth-manager/jwt.interface';
import {
  CERTIFICATES,
  MATERIAL_DOCS,
  NAME_UPDATE_QUEUE,
  VENDOR_COMPLIANCE_QUEUE,
} from 'als/building-block/constants';
import { MaterialDocumentAndCertificateUpdate } from 'als/building-block/RequestableDto/Project/MaterialDocsCertsUpdate';
import { ProjectCreator } from 'als/building-block/RequestableDto/Project/ProjectCreator';
import { ProjectAdditionalInsuredUpdateDto } from 'als/building-block/RequestableDto/Project/ProjectInsuredUpdate';
import {
  ContactUpdate,
  ProjectContactUpdate,
  ProjectIds,
  ProjectNotesUpdate,
  ProjectUpdate,
  ProjectWaiverUpdate,
  UnAssignedVendor,
} from 'als/building-block/RequestableDto/Project/ProjectUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ProjectCompleteResponseDTO } from 'als/building-block/TransferableDto/Project/Project';
import { ProjectPartialResponseDTO } from 'als/building-block/TransferableDto/Project/ProjectPartial';
import { ServiceError } from 'als/building-block/utils/apiError';
import { MATERIAL_DOCS_CERTS_UPDATE_ENUM } from 'als/building-block/utils/enum';
import { errorHandler } from 'als/building-block/utils/errorHandler';
import {
  createQueryparams,
  getQueryConditions,
} from 'als/building-block/utils/queryParams';
import { Queue } from 'bullmq';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { ComplianceCreator } from '../../../building-block/RequestableDto/Compliance/ComplianceCreator';
import { AssignProjectModel } from '../assign-project/assign-project.model';
import { ComplianceModel } from '../compliance/model/compliance.model';
import {
  AssignedVendor,
  ProjectModel as projectModel,
  ProjectModelDocument,
} from './project.model';
import { IProjectService } from './project-service';

@Injectable()
export class ProjectManagerService
  extends AutomapperProfile
  implements IProjectService
{
  constructor(
    @InjectMapper() readonly mapper: Mapper,
    @InjectModel(projectModel.name)
    readonly ProjectModel: Model<ProjectModelDocument>,
    @InjectModel(ComplianceModel.name)
    readonly ComplianceModel: Model<ComplianceModel>,
    @InjectQueue(VENDOR_COMPLIANCE_QUEUE)
    private readonly vendorComplianceQueue: Queue,
    @InjectModel(AssignProjectModel.name)
    private readonly AssignProjectModel: Model<AssignProjectModel>,
    @InjectQueue(NAME_UPDATE_QUEUE)
    private readonly nameUpdateConsumer: Queue,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        projectModel,
        ProjectPartialResponseDTO,
        forMember(
          d => d.client,
          mapFrom(s => s.client),
        ),
        forMember(
          d => d.manager,
          mapFrom(s => s.manager),
        ),
        forMember(
          d => d.documents,
          mapFrom(s => s.documents),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
        forMember(
          d => d.assigned_vendor_count,
          mapFrom(s => s.assigned_vendor.length),
        ),
      );
      createMap(
        mapper,
        projectModel,
        ProjectCompleteResponseDTO,
        forMember(
          d => d.client,
          mapFrom(s => s.client),
        ),
        forMember(
          d => d.manager,
          mapFrom(s => s.manager),
        ),
        forMember(
          d => d.documents,
          mapFrom(s => s.documents),
        ),
        forMember(
          d => d.contacts,
          mapFrom(s => s.contacts),
        ),
        forMember(
          d => d.tags,
          mapFrom(s => s.tags),
        ),
        forMember(
          d => d.certificate_holders,
          mapFrom(s => s.certificate_holders),
        ),
        forMember(
          d => d.parties_to_the_transaction,
          mapFrom(s => s.parties_to_the_transaction),
        ),
        forMember(
          d => d.assigned_vendor,
          mapFrom(s => s.assigned_vendor),
        ),
        forMember(
          d => d.deal_summary,
          mapFrom(s => s.deal_summary),
        ),
        forMember(
          d => d.project_schedule,
          mapFrom(s => s.project_schedule),
        ),
        forMember(
          d => d.material_documents,
          mapFrom(s => s.material_documents),
        ),
        forMember(
          d => d.certificates,
          mapFrom(s => s.certificates),
        ),
      );
    };
  }
  async create(projectCreatorDto: ProjectCreator) {
    try {
      const projectData = {
        ...projectCreatorDto,
        material_documents: MATERIAL_DOCS,
        certificates: CERTIFICATES,
      };

      const res = await this.ProjectModel.create(projectData);
      return this.mapper.map(res, projectModel, ProjectPartialResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAll(query?: SearchableDto) {
    try {
      const queryConditions: { $or?: Record<string, unknown>[] } = {};
      let pagination: { page: number; limit: number } = {
        page: 1,
        limit: 0,
      };

      if (!isEmpty(query)) {
        const { conditions, pagination: paginationData } = createQueryparams(
          query,
          ['client.name', 'name', 'manager.name'],
        );

        pagination = paginationData;
        queryConditions.$or = getQueryConditions(conditions);
      }

      const totalCount = await this.ProjectModel.find(queryConditions).count();
      const skip = pagination.limit * (pagination.page - 1);
      const res = await this.ProjectModel.find(queryConditions)
        .skip(skip)
        .limit(pagination.limit)
        .sort({ name: 1 });

      const page = pagination.page;
      const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
      const data = this.mapper.mapArray(
        res,
        projectModel,
        ProjectPartialResponseDTO,
      );

      return {
        page,
        perPage: perPage ? perPage : totalCount,
        total: totalCount,
        data,
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getById(id: string) {
    try {
      const res = await this.ProjectModel.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contacts',
            foreignField: '_id',
            as: 'contacts',
          },
        },
        {
          $lookup: {
            from: 'tagmodels',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
      ]);

      return this.mapper.map(res[0], projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async update(id: string, updatePayloadDto: ProjectUpdate) {
    try {
      const oldProject = await this.ProjectModel.findById(id);
      const res = await this.ProjectModel.findOneAndUpdate(
        {
          _id: id,
        },
        updatePayloadDto,
        { new: true, overwrite: false },
      );

      if (oldProject?.name !== res?.name) {
        const nameUpdateData = {
          project_id: new ObjectId(id),
          project_name: res?.name,
          type: 'project',
        };

        await this.nameUpdateConsumer.add(NAME_UPDATE_QUEUE, {
          ...nameUpdateData,
        });
      }

      // we can pass undefined
      return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteAll() {
    try {
      await this.ProjectModel.deleteMany();
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async addVendorAssignment(
    id: string,
    updatePayload: AssignedVendor,
    user: UserAssignedToRequest,
  ) {
    try {
      const project = await this.ProjectModel.findOne({
        _id: id,
      }).select(['assigned_vendor', 'client']);

      if (!project) {
        throw new ServiceError('Not Found', HttpStatus.BAD_REQUEST);
      }

      const existingVendor = await this.ProjectModel.findOne({
        _id: id,
        'assigned_vendor.vendor_id': updatePayload.vendor_id,
      });

      if (existingVendor) {
        throw new ServiceError(
          'Vendor Compliance Already exist for this Project!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.ProjectModel.findByIdAndUpdate(
        { _id: id },
        { $push: { assigned_vendor: updatePayload } },
        { new: true },
      );

      if (!res) {
        throw new ServiceError('Not Found', HttpStatus.BAD_REQUEST);
      }

      const complianceData: ComplianceCreator = {
        project_id: new ObjectId(id),
        project_name: res.name,
        requirement_group_id: updatePayload.requirement_group_id,
        vendor_id: updatePayload.vendor_id,
        vendor_name: updatePayload.vendor_name,
        client_id: new ObjectId(project?.client.client_id),
        client_name: project?.client.name,
        user_id: user.userId,
      };

      await this.vendorComplianceQueue.add(VENDOR_COMPLIANCE_QUEUE, {
        ...complianceData,
      });
      return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  async removeVendorAssignment(id: string, updatePayload: UnAssignedVendor) {
    try {
      const project = await this.ProjectModel.findOne({
        _id: id,
      }).select('assigned_vendor');

      if (!project) {
        throw new ServiceError('Project Not Found', HttpStatus.NOT_FOUND);
      }

      const vendor_to_remove = project?.assigned_vendor.find(
        vendor =>
          vendor._id.toString() ===
          updatePayload.vendor_assignement_id.toString(),
      );

      if (!vendor_to_remove) {
        throw new ServiceError(`Vendor Not Found`, HttpStatus.NOT_FOUND);
      }

      const res = await this.ProjectModel.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            assigned_vendor: { _id: updatePayload.vendor_assignement_id },
          },
        },
        { new: true, overwrite: false },
      );

      const compliance = await this.ComplianceModel.findOneAndUpdate(
        {
          vendor_id: vendor_to_remove?.vendor_id,
          requirement_group_id: vendor_to_remove?.requirement_group_id,
          project_id: id,
          status: true,
        },
        {
          $set: {
            status: false,
          },
        },
      );

      // remove all assign project where compliance status is false
      await this.AssignProjectModel.deleteMany({
        compliance_id: compliance?._id,
      });

      return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateMaterialDocsAndCerts(
    id: string,
    updatePayload: MaterialDocumentAndCertificateUpdate,
  ) {
    try {
      const updateFields: Record<string, unknown> = this.getUpdateFields(
        updatePayload,
        updatePayload.type,
      );

      const condition: Record<string, unknown> = {};
      updatePayload.type === MATERIAL_DOCS_CERTS_UPDATE_ENUM.MATERIAL_DOCS
        ? (condition[`${MATERIAL_DOCS_CERTS_UPDATE_ENUM.MATERIAL_DOCS}._id`] =
            new ObjectId(updatePayload._id))
        : (condition[`${MATERIAL_DOCS_CERTS_UPDATE_ENUM.CERTS}._id`] =
            new ObjectId(updatePayload._id));

      const project = await this.ProjectModel.findOneAndUpdate(
        {
          _id: id,
          ...condition,
        },
        {
          $set: {
            ...updateFields,
          },
        },
        { new: true },
      );

      return this.mapper.map(project, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }
  getUpdateFields = (
    updatePayload: MaterialDocumentAndCertificateUpdate,
    dbField: string,
  ): Record<string, unknown> => {
    const updateFields: Record<string, unknown> = {};
    const items: Omit<MaterialDocumentAndCertificateUpdate, '_id' | 'type'> = {
      comments: updatePayload.comments,
      status: updatePayload.status,
      vers_date: updatePayload.vers_date,
    };

    Object.keys(items).forEach(key => {
      if (items[key as keyof typeof items]) {
        updateFields[`${dbField}.$.${key}`] = items[key as keyof typeof items];
      }
    });
    return updateFields;
  };

  async getByClientId(client_id: string) {
    try {
      const res = await this.ProjectModel.aggregate([
        {
          $match: {
            'client.client_id': new ObjectId(client_id),
          },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contacts',
            foreignField: '_id',
            as: 'contacts',
          },
        },
      ]);

      return this.mapper.mapArray(
        res,
        projectModel,
        ProjectCompleteResponseDTO,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async contactAssignment(id: string, updatePayload: ContactUpdate) {
    try {
      const project = await this.ProjectModel.findOne({
        _id: id,
      }).select('contacts');

      if (
        project?.contacts.find(
          contact => contact.toString() === updatePayload._id.toString(),
        )
      ) {
        throw new ServiceError(
          'Contact already exist for this Project',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.ProjectModel.findByIdAndUpdate(
        { _id: id },
        { $push: { contacts: updatePayload._id } },
        { new: true },
      );

      return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async removeContactAssignment(id: string, updatePayload: ContactUpdate) {
    try {
      const project = await this.ProjectModel.findOne({
        _id: id,
      }).select('contacts');

      if (!project) {
        throw new ServiceError('Project Not Found', HttpStatus.NOT_FOUND);
      }

      const contacts_to_remove = project?.contacts.find(
        contact => contact.toString() === updatePayload._id.toString(),
      );

      if (!contacts_to_remove) {
        throw new ServiceError(`Contact Not Found`, HttpStatus.NOT_FOUND);
      }

      const res = await this.ProjectModel.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            contacts: updatePayload._id,
          },
        },
        { new: true, overwrite: false },
      );

      return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getAssignedContacts(project_id: ProjectIds) {
    try {
      const response = await this.ProjectModel.aggregate([
        {
          $match: {
            _id: {
              $in: project_id.project_id.map(id => new ObjectId(id)),
            },
          },
        },
        {
          $unwind: '$assigned_vendor',
        },
        {
          $lookup: {
            from: 'vendormodels',
            localField: 'assigned_vendor.vendor_id',
            foreignField: '_id',
            as: 'vendor',
          },
        },
        {
          $unwind: '$vendor',
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'vendor.contacts_id',
            foreignField: '_id',
            as: 'contact_details',
          },
        },
        {
          $unwind: '$contact_details',
        },
        {
          $project: {
            _id: '$contact_details._id',
            first_name: '$contact_details.first_name',
            last_name: '$contact_details.last_name',
            company_name: '$contact_details.company_name',
            type: '$contact_details.type',
          },
        },
      ]);

      const result = await this.ProjectModel.aggregate([
        {
          $match: {
            _id: {
              $in: project_id.project_id.map(id => new ObjectId(id)),
            },
          },
        },
        {
          $lookup: {
            from: 'contactmodels',
            localField: 'contacts',
            foreignField: '_id',
            as: 'contactsInfo',
          },
        },
        {
          $unwind: '$contactsInfo',
        },
        {
          $project: {
            _id: '$contactsInfo._id',
            first_name: '$contactsInfo.first_name',
            last_name: '$contactsInfo.last_name',
            company_name: '$contactsInfo.company_name',
            type: '$contactsInfo.type',
          },
        },
      ]);

      const res = response.concat(result);

      return res;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async assignContacts(
    id: string,
    contactUpdatePayloadDto: ProjectContactUpdate,
  ) {
    try {
      const alreadyExists = await this.ProjectModel.findOne({
        _id: new ObjectId(id),
        contacts: new ObjectId(contactUpdatePayloadDto.contact_id),
      });

      if (alreadyExists) {
        const res = await this.ProjectModel.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $pull: {
              contacts: contactUpdatePayloadDto.contact_id,
            },
          },
          { new: true, overwrite: false },
        );

        if (!res) {
          throw new ServiceError(
            'Failed To Update Contact',
            HttpStatus.BAD_REQUEST,
          );
        }

        return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
      }

      const res = await this.ProjectModel.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $push: {
            contacts: [contactUpdatePayloadDto.contact_id],
          },
        },
        { new: true, overwrite: false },
      );

      if (!res) {
        throw new ServiceError(
          'Failed To Update Contact',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.mapper.map(res, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getVendorProjects(id: string) {
    try {
      const projects = await this.ProjectModel.find({
        'assigned_vendor.vendor_id': id,
      });

      return this.mapper.mapArray(
        projects,
        projectModel,
        ProjectPartialResponseDTO,
      );
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateNotes(
    id: string,
    projectNotesPayload: ProjectNotesUpdate,
  ): Promise<ProjectCompleteResponseDTO | null> {
    try {
      const project = await this.ProjectModel.findOneAndUpdate(
        { _id: id },
        { notes: projectNotesPayload.notes },
        { new: true, overwrite: false },
      );

      return this.mapper.map(project, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateWaiver(
    id: string,
    projectWaiverPayload: ProjectWaiverUpdate,
  ): Promise<ProjectCompleteResponseDTO | null> {
    try {
      const project = await this.ProjectModel.findOneAndUpdate(
        { _id: id },
        { waivers: projectWaiverPayload.waiver },
        { new: true, overwrite: false },
      );

      return this.mapper.map(project, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateProjectDocuments(id: string, payload: any) {
    try {
      const existingProject = await this.getById(id);
      if (!existingProject) {
        throw new ServiceError(
          `Project with that id doesn't exist!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const project = await this.ProjectModel.findOneAndUpdate(
        { _id: id },
        { $set: { 'documents.$[elem].documents': payload.documents } },
        { arrayFilters: [{ 'elem.type': payload.type }], new: true },
      );

      return this.mapper.map(project, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }

  //-----------
  async updateAdditionalInsured(
    id: string,
    payload: ProjectAdditionalInsuredUpdateDto,
  ) {
    try {
      const existingProject = await this.getById(id);
      if (!existingProject) {
        throw new ServiceError(
          `Project with that id doesn't exist!`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const project = await this.ProjectModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            'parties_to_the_transaction.additional_insured':
              payload.additional_insured,
          },
        },
        { new: true },
      );

      return this.mapper.map(project, projectModel, ProjectCompleteResponseDTO);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
