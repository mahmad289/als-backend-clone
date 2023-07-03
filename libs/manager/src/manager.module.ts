import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingBlockModule } from 'als/building-block';
import { EmailService } from 'libs/email-service/EmailService';

import { IAssignProjectService } from './assign-project/assign-project.service';
import { AssignProjectManagerService } from './assign-project/assign-project-manager.service';
import { IAutoNotificationService } from './auto-notification/auto-notification.service';
import { AutoNotificationManagerService } from './auto-notification/auto-notification-manager.service';
import { BullMQModule } from './bullmq.module';
import { IClientService } from './client/client.service';
import { ClientManagerService } from './client/client-manager.service';
import { ICommunicationService } from './communication/communication.service';
import { CommunicationManagerService } from './communication/communication-manager.service';
import { ICommunicationTemplateService } from './communication-template/communication-template.service';
import { CommunicationTemplateManagerService } from './communication-template/communication-template-manager.service';
import { IComplianceService } from './compliance/services/compliance.service';
import { ComplianceManagerService } from './compliance/services/compliance-manager.service';
import { IContactService } from './contact/contact.service';
import { ContactManagerService } from './contact/contact-manager.service';
import { DatabaseModule } from './database.module';
import { IDocumentUploadService } from './document-upload/document-upload.service';
import { DocumentUploadManagerService } from './document-upload/document-upload-manager.service';
import { IEscalationService } from './escalation/escalation.service';
import { EscalationManagerService } from './escalation/escalation-manager.service';
import { FileManagerService } from './file-manager/file-manager.service';
import { IFileManagerService } from './file-manager/file-manager-interface';
import { IOtpService } from './otp/otp.service';
import { OtpManagerService } from './otp/otp-manager.service';
import { ProjectManagerService } from './project/project-manager.service';
import { IProjectService } from './project/project-service';
import { ICoverageTypeService } from './requirement-group/interfaces/coverage-type.service';
import { IDocumentCategoryService } from './requirement-group/interfaces/document-category.service';
import { IDocumentTypeService } from './requirement-group/interfaces/document-type.service';
import { IMasterRequirementService } from './requirement-group/interfaces/master-requirement.service';
import { IRequirementService } from './requirement-group/interfaces/requirements.service';
import { ITemplateService } from './requirement-group/interfaces/template.service';
import { CoverageTypeManagerService } from './requirement-group/services/coverage-type-manager.service';
import { DocumentCategoryManagerService } from './requirement-group/services/document-category-manager.service';
import { DocumentTypeManagerService } from './requirement-group/services/document-type-manager.service';
import { MasterRequirementManagerService } from './requirement-group/services/master-requirement-manager.service';
import { RequirementsService } from './requirement-group/services/requirements-manager.service';
import { TemplateManagerService } from './requirement-group/services/template-manager.service';
import { ITagService } from './tag/tag.service';
import { TagManagerService } from './tag/tag-manager.service';
import { UploadManagerService } from './upload/upload-manager.service';
import { IUploadService } from './upload/upload-service';
import { IUserService } from './user/user.service';
import { UserManagerService } from './user/user-manager.service';
import { IVendorService } from './vendor/vendor.service';
import { VendorManagerService } from './vendor/vendor-manager.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(`${process.env.DB_URL}`),
    BuildingBlockModule,
    DatabaseModule,
    BullMQModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET') || 'secret',
          signOptions: { expiresIn: '7d' },
        };
      },
    }),

    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    TagManagerService,
    UserManagerService,
    EmailService,
    OtpManagerService,
    ClientManagerService,
    ContactManagerService,
    VendorManagerService,
    CoverageTypeManagerService,
    DocumentCategoryManagerService,
    DocumentTypeManagerService,
    MasterRequirementManagerService,
    RequirementsService,
    TemplateManagerService,
    CommunicationTemplateManagerService,
    ProjectManagerService,
    UploadManagerService,
    ComplianceManagerService,
    FileManagerService,
    AutoNotificationManagerService,
    EscalationManagerService,
    CommunicationManagerService,
    {
      provide: IAutoNotificationService,
      useClass: AutoNotificationManagerService,
    },
    { provide: IUserService, useClass: UserManagerService },
    { provide: IClientService, useClass: ClientManagerService },
    { provide: IContactService, useClass: ContactManagerService },
    { provide: IVendorService, useClass: VendorManagerService },
    {
      provide: IMasterRequirementService,
      useClass: MasterRequirementManagerService,
    },
    { provide: IRequirementService, useClass: RequirementsService },
    { provide: IDocumentTypeService, useClass: DocumentTypeManagerService },
    { provide: ITemplateService, useClass: TemplateManagerService },

    { provide: ICoverageTypeService, useClass: CoverageTypeManagerService },
    {
      provide: IDocumentCategoryService,
      useClass: DocumentCategoryManagerService,
    },
    { provide: IAssignProjectService, useClass: AssignProjectManagerService },
    { provide: IProjectService, useClass: ProjectManagerService },
    { provide: IUploadService, useClass: UploadManagerService },
    AssignProjectManagerService,
    { provide: IOtpService, useClass: OtpManagerService },
    { provide: IComplianceService, useClass: ComplianceManagerService },
    { provide: IDocumentUploadService, useClass: DocumentUploadManagerService },
    {
      provide: ICommunicationTemplateService,
      useClass: CommunicationTemplateManagerService,
    },
    {
      provide: IFileManagerService,
      useClass: FileManagerService,
    },
    {
      provide: ITagService,
      useClass: TagManagerService,
    },
    {
      provide: IEscalationService,
      useClass: EscalationManagerService,
    },
    {
      provide: ICommunicationService,
      useClass: CommunicationManagerService,
    },
  ],

  exports: [
    DatabaseModule,
    TagManagerService,
    UserManagerService,
    EmailService,
    EscalationManagerService,
    CoverageTypeManagerService,
    DocumentCategoryManagerService,
    ClientManagerService,
    DocumentTypeManagerService,
    MasterRequirementManagerService,
    RequirementsService,
    TemplateManagerService,
    CommunicationTemplateManagerService,
    AutoNotificationManagerService,
    CommunicationManagerService,
    IUserService,
    IClientService,
    IContactService,
    IEscalationService,
    IVendorService,
    IRequirementService,
    IDocumentTypeService,
    IMasterRequirementService,
    ITemplateService,
    IAssignProjectService,
    ICoverageTypeService,
    IDocumentCategoryService,
    IProjectService,
    IUploadService,
    AssignProjectManagerService,
    IOtpService,
    IComplianceService,
    IDocumentUploadService,
    ICommunicationTemplateService,
    FileManagerService,
    IFileManagerService,
    IAutoNotificationService,
    ITagService,
    ICommunicationService,
  ],
})
export class ManagerModule {}
