import { AUTO_NOTIFICATION_ENTITIES } from 'als/building-block/utils/enum';

export interface templateType {
  type: string;
  entities: string[];
}

export const templateTypes: templateType[] = [
  {
    type: 'AutoNotification Request',
    entities: [
      AUTO_NOTIFICATION_ENTITIES.CLIENT,
      AUTO_NOTIFICATION_ENTITIES.VENDOR,
      AUTO_NOTIFICATION_ENTITIES.PROJECT,
      AUTO_NOTIFICATION_ENTITIES.CONTACT,
    ],
  },
  {
    type: 'AutoNotification Update',
    entities: [
      AUTO_NOTIFICATION_ENTITIES.CLIENT,
      AUTO_NOTIFICATION_ENTITIES.VENDOR,
      AUTO_NOTIFICATION_ENTITIES.PROJECT,
      AUTO_NOTIFICATION_ENTITIES.CONTACT,
    ],
  },
  {
    type: 'General Communication',
    entities: [
      AUTO_NOTIFICATION_ENTITIES.CLIENT,
      AUTO_NOTIFICATION_ENTITIES.VENDOR,
      AUTO_NOTIFICATION_ENTITIES.PROJECT,
      AUTO_NOTIFICATION_ENTITIES.CONTACT,
    ],
  },
  {
    type: 'Project Communication',
    entities: [
      AUTO_NOTIFICATION_ENTITIES.CLIENT,
      AUTO_NOTIFICATION_ENTITIES.VENDOR,
      AUTO_NOTIFICATION_ENTITIES.PROJECT,
      AUTO_NOTIFICATION_ENTITIES.CONTACT,
    ],
  },
];

export const templateEntities = [
  {
    name: '#clientName#',
    resolve_to: 'name',
    entity_type: 'client',
  },
  {
    name: '#clientType#',
    resolve_to: 'client_type',
    entity_type: 'client',
  },
  {
    name: '#clientAddress1#',
    resolve_to: 'address_1',
    entity_type: 'client',
  },
  {
    name: '#clientCity#',
    resolve_to: 'city',
    entity_type: 'client',
  },
  {
    name: '#clientState#',
    resolve_to: 'state',
    entity_type: 'client',
  },
  {
    name: '#clientZipCode#',
    resolve_to: 'zip',
    entity_type: 'client',
  },
  {
    name: '#vendorUserName#',
    resolve_to: 'username',
    entity_type: 'vendor',
  },
  {
    name: '#vendoremailAddress#',
    resolve_to: 'email',
    entity_type: 'vendor',
  },
  {
    name: '#vendorAddress1#',
    resolve_to: 'address_1',
    entity_type: 'vendor',
  },
  {
    name: '#vendorCity#',
    resolve_to: 'city',
    entity_type: 'vendor',
  },
  {
    name: '#vendorState#',
    resolve_to: 'state',
    entity_type: 'vendor',
  },
  {
    name: '#vendorZipCode#',
    resolve_to: 'zip',
    entity_type: 'vendor',
  },
  {
    name: '#vendorFirstName#',
    resolve_to: 'first_name',
    entity_type: 'vendor',
  },
  {
    name: '#vendorLastName#',
    resolve_to: 'last_name',
    entity_type: 'vendor',
  },
  {
    name: '#vendorName#',
    resolve_to: 'vendor_name',
    entity_type: 'vendor',
  },
  {
    name: '#vendorAlias#',
    resolve_to: 'alias',
    entity_type: 'vendor',
  },
  {
    name: '#vendorPhoneNumber#',
    resolve_to: 'phone_number',
    entity_type: 'vendor',
  },
  {
    name: '#contactFirstName#',
    resolve_to: 'first_name',
    entity_type: 'contact',
  },
  {
    name: '#contactLastName#',
    resolve_to: 'last_name',
    entity_type: 'contact',
  },
  {
    name: '#contactCompanyName#',
    resolve_to: 'company_name',
    entity_type: 'contact',
  },
  {
    name: '#contactTitle#',
    resolve_to: 'title',
    entity_type: 'contact',
  },
  {
    name: '#contactEmailAddress#',
    resolve_to: 'email',
    entity_type: 'contact',
  },
  {
    name: '#contactPhoneNumber#',
    resolve_to: 'phone_number',
    entity_type: 'contact',
  },
  {
    name: '#contactAddress1#',
    resolve_to: 'address_1',
    entity_type: 'contact',
  },
  {
    name: '#contactCity#',
    resolve_to: 'city',
    entity_type: 'contact',
  },
  {
    name: '#contactState#',
    resolve_to: 'state',
    entity_type: 'contact',
  },
  {
    name: '#contactZipCode#',
    resolve_to: 'zip',
    entity_type: 'contact',
  },
  {
    name: '#contactMobileNumber#',
    resolve_to: 'mobile',
    entity_type: 'contact',
  },
  {
    name: '#contactType#',
    resolve_to: 'type',
    entity_type: 'contact',
  },
  {
    name: '#alsUserName#',
    resolve_to: 'username',
    entity_type: 'user',
  },
  {
    name: '#alsUserPhoneNumber#',
    resolve_to: 'phone_number',
    entity_type: 'user',
  },
  {
    name: '#alsUserRole#',
    resolve_to: 'role',
    entity_type: 'user',
  },
  {
    name: '#alsUserEmailAddress#',
    resolve_to: 'email',
    entity_type: 'user',
  },
  {
    name: '#alsUserFirstName#',
    resolve_to: 'first_name',
    entity_type: 'user',
  },
  {
    name: '#alsUserLastName#',
    resolve_to: 'last_name',
    entity_type: 'user',
  },
  {
    name: '#projectName#',
    resolve_to: 'name',
    entity_type: 'project',
  },
  {
    name: '#projectAddress1#',
    resolve_to: 'address_1',
    entity_type: 'project',
  },
  {
    name: '#projectCity#',
    resolve_to: 'city',
    entity_type: 'project',
  },
  {
    name: '#projectState#',
    resolve_to: 'state',
    entity_type: 'project',
  },
  {
    name: '#projectZipCode#',
    resolve_to: 'zip',
    entity_type: 'project',
  },
  {
    name: '#projectManager#',
    resolve_to: 'manager',
    entity_type: 'project',
  },
  {
    name: '#projectCertificateHoldersFirstNames#',
    resolve_to: 'certificate_holders.first_name',
    entity_type: 'project',
  },
  {
    name: '#projectCertificateHoldersLastNames#',
    resolve_to: 'certificate_holders.last_name',
    entity_type: 'project',
  },
  {
    name: '#projectClosingDate#',
    resolve_to: 'project_schedule.closing_date',
    entity_type: 'project',
  },
  {
    name: '#projectStartDate#',
    resolve_to: 'project_schedule.const_start_date',
    entity_type: 'project',
  },
  {
    name: '#projectHardCost#',
    resolve_to: 'project_schedule.hard_costs',
    entity_type: 'project',
  },
  {
    name: '#projectSoftCost#',
    resolve_to: 'project_schedule.soft_costs',
    entity_type: 'project',
  },
  {
    name: '#projectArea#',
    resolve_to: 'deal_summary.total_square_foot',
    entity_type: 'project',
  },
  {
    name: '#projectDescription#',
    resolve_to: 'deal_summary.project_description',
    entity_type: 'project',
  },
  {
    name: '#projectConstructionType#',
    resolve_to: 'deal_summary.construction_type',
    entity_type: 'project',
  },
  {
    name: '#projectOtherInfo#',
    resolve_to: 'deal_summary.other_key_info',
    entity_type: 'project',
  },
  {
    name: '#projectConstructionPeriod#',
    resolve_to: 'deal_summary.est_const_period',
    entity_type: 'project',
  },
  {
    name: '#projectEngineer#',
    resolve_to: 'deal_summary.engineer',
    entity_type: 'project',
  },
  {
    name: '#projectTenancy#',
    resolve_to: 'deal_summary.tenancy',
    entity_type: 'project',
  },
  {
    name: '#projectMaterial&CertificatesComment#',
    resolve_to: 'material_document_and_certificates.comment',
    entity_type: 'project',
  },
  {
    name: '#projectMaterial&CertificatesStatus#',
    resolve_to: 'material_document_and_certificates.status',
    entity_type: 'project',
  },
];
