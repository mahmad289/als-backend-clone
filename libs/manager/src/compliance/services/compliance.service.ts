import { ComplianceCreator } from 'als/building-block/RequestableDto/Compliance/ComplianceCreator';
import { ComplianceItemUpdateDto } from 'als/building-block/RequestableDto/Compliance/ComplianceItemUpdate';
import { ComplianceUpdate } from 'als/building-block/RequestableDto/Compliance/ComplianceUpdate';
import { UpdateDocumentDateDto } from 'als/building-block/RequestableDto/Compliance/UpdateDocumentDate';
import { OCRDto } from 'als/building-block/RequestableDto/OCR/OCR.dto';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { IGetAllResponse } from 'als/building-block/utils/genericInterface';
import { ObjectId } from 'mongodb';

import { ComplianceModel } from '../model/compliance.model';

export abstract class IComplianceService {
  abstract getAll(
    query?: SearchableDto,
  ): Promise<IGetAllResponse<ComplianceCompleteResponsDto>>;
  abstract create(
    complianceCreatorPayloadDto: ComplianceCreator,
  ): Promise<ComplianceCompleteResponsDto>;
  abstract update(
    id: string,
    updatePayloadDto: ComplianceUpdate,
    contactId: ObjectId,
  ): Promise<ComplianceCompleteResponsDto | null>;
  abstract updateComplianceItem(
    id: string,
    updatePayloadDto: ComplianceItemUpdateDto,
  ): Promise<ComplianceCompleteResponsDto | null>;
  abstract updateDocumentDate(
    id: string,
    updatePayloadDto: UpdateDocumentDateDto,
  ): Promise<ComplianceCompleteResponsDto>;
  abstract findOne(
    conditions: Partial<Record<keyof ComplianceModel, unknown>>,
  ): Promise<ComplianceCompleteResponsDto | null>;
  abstract getById(id: string): Promise<ComplianceCompleteResponsDto>;
  abstract getComplianceForReview(
    client_id: string,
    project_id: string,
    vendor_id: string,
  ): Promise<ComplianceCompleteResponsDto>;
  abstract updateByRequirementGroup(
    requirement_group_id: string,
    master_requirement_id: string,
    action: string,
  ): Promise<void>;
  abstract updateByTemplate(
    requirement_group_id: string,
    old_template_id: string | undefined,
    new_template_id: string,
  ): Promise<void>;
  abstract updateByTemplateEdit(
    template_id: string,
    rules_id: string[],
    action: string,
  ): Promise<void>;
  abstract updateComplianceValue(
    OcrData: OCRDto,
  ): Promise<ComplianceCompleteResponsDto>;
  abstract updateComplianceStatus(
    id: string,
  ): Promise<ComplianceCompleteResponsDto>;
  abstract updateComplianceOCRData(payload: any): Promise<void>;
  abstract complianceByVendorAndProject(
    project_id: string,
    vendor_id: string,
  ): Promise<ComplianceCompleteResponsDto>;
}
