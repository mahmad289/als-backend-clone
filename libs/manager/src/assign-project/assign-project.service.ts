import { AssignProjectCreator } from 'als/building-block/RequestableDto/AssignProject/AssignProjectCreator';
import { AssignProjectCompleteResponseDto } from 'als/building-block/TransferableDto/AssignProject/AssignProject';
import { ContactCompleteResponseDto } from 'als/building-block/TransferableDto/Contact/Contact';

import { AssignProjectModel } from './assign-project.model';

export abstract class IAssignProjectService {
  abstract create(
    createPayloadDto: AssignProjectCreator,
  ): Promise<AssignProjectCompleteResponseDto>;
  abstract getById(
    id: string,
  ): Promise<AssignProjectCompleteResponseDto | null>;
  abstract findOne(
    key: Partial<Record<keyof AssignProjectModel, unknown>>,
  ): Promise<AssignProjectCompleteResponseDto | null>;
  abstract vendorDashboard(
    uuid: string,
    contact: ContactCompleteResponseDto,
  ): Promise<unknown>;
}
