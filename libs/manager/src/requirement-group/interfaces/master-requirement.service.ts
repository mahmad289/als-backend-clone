import { MasterRequirementCreator } from 'als/building-block/RequestableDto/MasterRequirement/MasterRequirementCreator';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { MasterRequirementCompleteResponseDto } from 'als/building-block/TransferableDto/MasterRequirement/MasterRequirement';
import { MasterRequirementPartialResponseDto } from 'als/building-block/TransferableDto/MasterRequirement/MasterRequirementPartial';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';
import { FilterQuery } from 'mongoose';

import { MasterRequirementModelDocument } from '../model/master-requirement.model';

export abstract class IMasterRequirementService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<MasterRequirementPartialResponseDto>>;
  abstract create(
    createPayloadDto: MasterRequirementCreator,
  ): Promise<MasterRequirementCompleteResponseDto>;
  abstract find(
    filterQuery: FilterQuery<MasterRequirementModelDocument>,
    query?: SearchableDto,
  ): Promise<IGetAllResponse<MasterRequirementPartialResponseDto>>;
  abstract getById(
    id: string,
  ): Promise<MasterRequirementCompleteResponseDto | null>;
  abstract deleteAll(): Promise<void>;
}
