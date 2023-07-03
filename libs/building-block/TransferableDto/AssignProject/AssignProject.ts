import { AutoMap } from '@automapper/classes';
import { ComplianceCompleteResponsDto } from 'als/building-block/TransferableDto/Compliance/Compliance';
import { ObjectId } from 'mongodb';

import { ContactCompleteResponseDto } from '../Contact/Contact';
import { ProjectCompleteResponseDTO } from '../Project/Project';
import { VendorCompleteResponseDto } from '../Vendor/Vendor';

export class AssignProjectCompleteResponseDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  uuid: string;

  @AutoMap()
  vendor_id: ObjectId;

  @AutoMap()
  requirement_group_id: ObjectId;

  @AutoMap()
  compliance_id: ObjectId;

  @AutoMap()
  project_id: ObjectId;

  @AutoMap()
  contact_id: ObjectId;

  @AutoMap()
  vendor?: VendorCompleteResponseDto;

  @AutoMap()
  compliance?: ComplianceCompleteResponsDto;

  @AutoMap()
  project?: ProjectCompleteResponseDTO;

  @AutoMap()
  contact?: ContactCompleteResponseDto;
}
