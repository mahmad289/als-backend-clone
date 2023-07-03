import { TemplateCopyCreator } from 'als/building-block/RequestableDto/Template/TemplateCopyCreator';
import {
  RuleDto,
  TemplateCreator,
} from 'als/building-block/RequestableDto/Template/TemplateCreator';
import {
  TemplateNameUpdate,
  TemplateUpdate,
} from 'als/building-block/RequestableDto/Template/TemplateUpdate';
import { TemplateCompleteResponseDto } from 'als/building-block/TransferableDto/Template/Template';
import { FilterQuery } from 'mongoose';

import { RuleEntity, TemplateModelDocument } from '../model/template.model';

export abstract class ITemplateService {
  abstract create(
    templateCreator: TemplateCreator,
  ): Promise<TemplateCompleteResponseDto>;

  abstract find(
    filterQuery: FilterQuery<TemplateModelDocument>,
  ): Promise<TemplateCompleteResponseDto[]>;

  abstract getById(id: string): Promise<TemplateCompleteResponseDto>;
  abstract getRuleById(
    id: string,
    master_requirement_id: string,
  ): Promise<RuleEntity | unknown>;
  abstract update(
    id: string,
    templateUpdate: TemplateUpdate,
  ): Promise<TemplateCompleteResponseDto>;
  abstract deleteAll(): Promise<void>;
  abstract deleteOne(id: string): Promise<{ message: string }>;
  abstract createCopy(
    createPayloadDto: TemplateCopyCreator,
  ): Promise<TemplateCompleteResponseDto>;
  abstract toggleRuleStatus(
    id: string,
    master_requirement_id: string,
  ): Promise<TemplateCompleteResponseDto | unknown>;
  abstract updateRuleById(
    id: string,
    master_requirement_id: string,
    templateUpdate: RuleDto,
  ): Promise<TemplateCompleteResponseDto | unknown>;
  abstract templateNameEdit(id: string, name: TemplateNameUpdate): Promise<any>;
}
