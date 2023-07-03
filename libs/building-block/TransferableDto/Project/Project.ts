import { AutoMap } from '@automapper/classes';
import {
  AssignedVendor,
  CertificateHolders,
  Client,
  DealSummary,
  Document,
  Manager,
  MaterialDocumentAndCertificate,
  PartiesToTheTransaction,
  ProjectSchedule,
} from 'als/manager/project/project.model';
import { ObjectId } from 'mongodb';

export class ProjectCompleteResponseDTO {
  @AutoMap()
  _id: ObjectId;

  @AutoMap(() => Client)
  client: Client;

  @AutoMap()
  name: string;

  @AutoMap()
  address_1: string;

  @AutoMap()
  address_2: string;

  @AutoMap()
  city: string;

  @AutoMap()
  tags: ObjectId[];

  @AutoMap()
  state: string;

  @AutoMap()
  property_name: string;

  @AutoMap()
  county: string;

  @AutoMap()
  zip: string;

  @AutoMap()
  notes: string;

  @AutoMap()
  waivers: string;

  @AutoMap(() => Manager)
  manager: Manager;

  @AutoMap(() => CertificateHolders)
  certificate_holders: CertificateHolders[];

  @AutoMap()
  contacts: any;

  @AutoMap(() => Document)
  documents: Document[];

  @AutoMap(() => AssignedVendor)
  assigned_vendor: AssignedVendor[];

  @AutoMap(() => PartiesToTheTransaction)
  parties_to_the_transaction: PartiesToTheTransaction;

  @AutoMap(() => ProjectSchedule)
  project_schedule: ProjectSchedule;

  @AutoMap(() => DealSummary)
  deal_summary: DealSummary;

  @AutoMap(() => MaterialDocumentAndCertificate)
  material_documents: MaterialDocumentAndCertificate[];

  @AutoMap(() => MaterialDocumentAndCertificate)
  certificates: MaterialDocumentAndCertificate[];
}
