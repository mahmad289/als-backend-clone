import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  AssignProjectModel,
  AssignProjectModelSchema,
} from './assign-project/assign-project.model';
import {
  AutoNotificationModel,
  AutoNotificationModelSchema,
} from './auto-notification/auto-notification.model';
import { ClientModel, ClientModelSchema } from './client/client.model';
import {
  CommunicationModel,
  CommunicationModelSchema,
} from './communication/communication.model';
import {
  CommunicationTemplateModel,
  CommunicationTemplateModelSchema,
} from './communication-template/communication-template.model';
import {
  ComplianceModel,
  ComplianceModelSchema,
} from './compliance/model/compliance.model';
import { ContactModel, ContactModelSchema } from './contact/contact.model';
import {
  DocumentUploadModel,
  DocumentUploadModelSchema,
} from './document-upload/document-upload.model';
import {
  EscalationModel,
  EscalationModelSchema,
} from './escalation/escalation.model';
import { OTPModel, OTPModelSchema } from './otp/otp.model';
import { ProjectModel, ProjectModelSchema } from './project/project.model';
import {
  CoverageTypeModel,
  CoverageTypeModelSchema,
} from './requirement-group/model/coverage-type.model';
import {
  DocumentCategoryModel,
  DocumentCategoryModelSchema,
} from './requirement-group/model/document-category.model';
import {
  DocumentTypeModel,
  DocumentTypeModelSchema,
} from './requirement-group/model/document-type.model';
import {
  MasterRequirementModel,
  MasterRequirementModelSchema,
} from './requirement-group/model/master-requirement.model';
import {
  RequirementsModel,
  RequirementsModelSchema,
} from './requirement-group/model/requirements.model';
import {
  TemplateModel,
  TemplateModelSchema,
} from './requirement-group/model/template.model';
import { TagModel, TagModelSchema } from './tag/tag.model';
import { UserModel, UserModelSchema } from './user/user.model';
import { VendorModel, VendorModelSchema } from './vendor/vendor.model';

const databaseProviders = [
  MongooseModule.forFeature([
    { name: UserModel.name, schema: UserModelSchema },
    { name: AssignProjectModel.name, schema: AssignProjectModelSchema },
    { name: ClientModel.name, schema: ClientModelSchema },
    { name: ContactModel.name, schema: ContactModelSchema },
    { name: VendorModel.name, schema: VendorModelSchema },
    // requiremnet models
    { name: CoverageTypeModel.name, schema: CoverageTypeModelSchema },
    { name: DocumentCategoryModel.name, schema: DocumentCategoryModelSchema },
    { name: DocumentTypeModel.name, schema: DocumentTypeModelSchema },
    {
      name: MasterRequirementModel.name,
      schema: MasterRequirementModelSchema,
    },
    {
      name: RequirementsModel.name,
      schema: RequirementsModelSchema,
    },
    {
      name: TemplateModel.name,
      schema: TemplateModelSchema,
    },
    {
      name: ComplianceModel.name,
      schema: ComplianceModelSchema,
    },
    {
      name: ProjectModel.name,
      schema: ProjectModelSchema,
    },
    { name: OTPModel.name, schema: OTPModelSchema },
    { name: DocumentUploadModel.name, schema: DocumentUploadModelSchema },
    {
      name: CommunicationTemplateModel.name,
      schema: CommunicationTemplateModelSchema,
    },
    {
      name: AutoNotificationModel.name,
      schema: AutoNotificationModelSchema,
    },
    {
      name: TagModel.name,
      schema: TagModelSchema,
    },
    {
      name: CommunicationModel.name,
      schema: CommunicationModelSchema,
    },
    {
      name: EscalationModel.name,
      schema: EscalationModelSchema,
    },
  ]),
];

@Module({
  imports: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
