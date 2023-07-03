import { UserAssignedToRequest } from 'als/auth-manager/jwt.interface';
import { MaterialDocumentAndCertificateUpdate } from 'als/building-block/RequestableDto/Project/MaterialDocsCertsUpdate';
import { ProjectCreator } from 'als/building-block/RequestableDto/Project/ProjectCreator';
import { ProjectDocsUpdateDto } from 'als/building-block/RequestableDto/Project/ProjectDocsUpdate';
import { ProjectAdditionalInsuredUpdateDto } from 'als/building-block/RequestableDto/Project/ProjectInsuredUpdate';
import {
  AssignedVendor,
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
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';

export abstract class IProjectService {
  abstract create(
    projectCreatorDto: ProjectCreator,
  ): Promise<ProjectPartialResponseDTO>;

  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<ProjectPartialResponseDTO>>;

  abstract getById(id: string): Promise<ProjectCompleteResponseDTO | null>;
  abstract getByClientId(id: string): Promise<ProjectCompleteResponseDTO[]>;
  abstract update(
    id: string,
    updatePayloadDto: ProjectUpdate,
  ): Promise<ProjectCompleteResponseDTO | null>;
  abstract updateNotes(
    id: string,
    projectNotesPayload: ProjectNotesUpdate,
  ): Promise<ProjectCompleteResponseDTO | null>;
  abstract updateWaiver(
    id: string,
    projectWaiverPayload: ProjectWaiverUpdate,
  ): Promise<ProjectCompleteResponseDTO | null>;
  abstract deleteAll(): Promise<void>;
  abstract addVendorAssignment(
    id: string,
    updatePayload: AssignedVendor,
    user: UserAssignedToRequest,
  ): Promise<ProjectCompleteResponseDTO>;
  abstract removeVendorAssignment(
    id: string,
    updatePayload: UnAssignedVendor,
  ): Promise<ProjectCompleteResponseDTO>;

  abstract updateMaterialDocsAndCerts(
    id: string,
    updatePayload: MaterialDocumentAndCertificateUpdate,
  ): Promise<ProjectCompleteResponseDTO | null>;

  abstract contactAssignment(
    id: string,
    updatePayload: ContactUpdate,
  ): Promise<ProjectCompleteResponseDTO>;

  abstract removeContactAssignment(
    id: string,
    updatePayload: ContactUpdate,
  ): Promise<ProjectCompleteResponseDTO>;

  abstract getAssignedContacts(projectIds: ProjectIds): Promise<any>;

  abstract assignContacts(
    id: string,
    contactUpdatePayloadDto: ProjectContactUpdate,
  ): Promise<ProjectCompleteResponseDTO>;
  abstract getVendorProjects(id: string): Promise<ProjectPartialResponseDTO[]>;
  abstract updateAdditionalInsured(
    id: string,
    payload: ProjectAdditionalInsuredUpdateDto,
  ): Promise<ProjectCompleteResponseDTO>;
  abstract updateProjectDocuments(
    id: string,
    payload: ProjectDocsUpdateDto,
  ): Promise<ProjectCompleteResponseDTO>;
}
