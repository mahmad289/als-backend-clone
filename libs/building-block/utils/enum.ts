// Values that are stored in DB
export enum COMPLIANCE_ITEM_STATUS_ENUM {
  STATUS_WHITE = 'W',
  STATUS_BLUE = 'B',
  STATUS_GREEN = 'G',
  STATUS_RED = 'R',
  STATUS_YELLOW = 'Y',
  STATUS_NA = 'N/A',
}
export enum CLIENT_TYPE_ENUM {
  REAL_ESTATE_DEVELOPMENT = 'Real Estate & Development',
  BANKING = 'Banking',
  RETAIL = 'Retail',
  ENERGY = 'Energy',
  HEALTHCARE = 'Healthcare',
  TRANSACTION_SERVICE_AND_PRIVATE_EQUITY = 'Transaction Service & Private Equity',
  FINANCIAL_SERVICES = 'Financial Services',
  NON_PROFIT = 'Non-Profit',
  TECHNOLOGY_AND_COMMUNICATION = 'Technology & Communication',
  CONSTRUCTION = 'Construction',
  GOVERNMENT = 'Government',
  EDUCATION = 'Education',
  ENTERTAINMENT = 'Entertainment',
  MISCELLANEOUS = 'Miscellaneous',
}
export enum COMPLIANCE_ITEM_TYPE_ENUM {
  COMPLIANCE = 'compliance',
  TEMPLATE = 'template',
}
export enum CONTACT_TYPE_ENUM {
  UNDERWRITER = 'Underwriter',
  LENDER = 'Lender',
  PROPERTY_MANAGER = 'Property Manager',
  BROKER = 'Broker',
  GENERAL_PARTNER = 'General Partner',
  GENERAL_PARTNER_BROKER = 'General Partner Broker',
  GENERAL_CONTRACTOR = 'General Contractor',
  GENERAL_CONTRACTOR_BROKER = 'General Contractor Broker',
  INSURANCE_COMPANY = 'Insurance Company',
  CLIENT = 'Client',
  RISK_MANAGER = 'Risk Manager',
  PARTNERSHIP = 'Partnership',
  ASSET_MANAGER = 'Asset Manager',
  SALES_MANAGER = 'Sales Manager',
  RELATIONSHIP_MANAGER = 'Relationship Manager',
}
export enum CONTACT_TYPE_CATEGORY_ENUM {
  CLIENT = 'client',
  PROJECT = 'project',
  VENDOR = 'vendor',
}

export enum PROJECT_DOCUMENT_TYPE_ENUM {
  EXECUTIVE_SUMMARY = 'executive_summary',
  ENDORSEMENTS = 'endorsements',
  INSURANCE_REQUIREMENT = 'insurance_requirement',
  RISK_REPORT = 'risk_report',
  ORGANIZATION_CHARTS = 'organization_charts',
}

export enum TEMPLATE_RULE_CONDITION_ENUM {
  REQUIRED = 'Required',
  GREATER_THAN = 'Greater than',
  GREATER_THAN_OR_EQUAL = 'Greater than or equal',
  LESS_THAN = 'Less than',
}
export enum USER_ROLE_ENUM {
  ADMIN = 'admin',
  RISK_MANAGER = 'risk_manager',
  BROKER = 'broker',
  CONSULTANT = 'consultant',
  INSURER = 'insurer',
}

// ENUMS unrelated to DB values
export enum COMPLIANCE_UPDATE_TEMPLATES {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
}

export enum TEMPLATE_TYPE_QUERY_ENUM {
  ACCORD_25 = 'acord25',
  ACCORD_28 = 'acord28',
}

export enum MATERIAL_DOCS_CERTS_UPDATE_ENUM {
  MATERIAL_DOCS = 'material_documents',
  CERTS = 'certificates',
}

export enum AUTO_NOTIFICATION_ENTITIES {
  CLIENT = 'client',
  PROJECT = 'project',
  VENDOR = 'vendor',
  CONTACT = 'contact',
}

export enum AUTO_NOTIFICATION_COMPLIANCE_STATUS {
  COMPLIANT = 'compliant',
  NOT_COMPLIANT_NOT_CRITICAL = 'not_compliant_not_critical',
  NOT_COMPLIANT_CRITICAL = 'not_compliant_critical',
}

export enum COMMUNICATION_TYPE {
  ONBOARDING = 'onboarding',
  AUTO_NOTIFICATION = 'auto_notification',
  ESCALATION = 'escalation',
}

export enum COMMUNICATION_RECIPIENT_TYPE {
  PROJECT = 'project',
  VENDOR = 'vendor',
  CLIENT = 'client',
}

// additional insured types
export enum ADDITIONAL_INSURED_TYPE {
  ONSITE_DELIVERY = 'Onsite Delivery',
  TENANT = 'Tenant',
  PARTNERSHIP = 'Partnership',
  GENERAL_CONTRACTOR = 'General Contractor',
  PROPERTY_MANAGER = 'Property Manager',
  SUPPLIER_OFFSITE_DELIVERY = 'Supplier - Offsite Delivery',
  OTHER = 'Other',
  SUPPLIER_CURBSIDE = 'Supplier - Curbside',
  SUBCONTRACTOR = 'Subcontractor',
  DESIGN_PROFESSIONAL = 'Design Professional',
  GENERAL_PARTNER = 'General Partner',
  CONSULTANT = 'Consultant',
  VENDOR = 'Vendor',
  ARCHITECT = 'Architect',
}

export enum COMMUNICATION_TEMPLATE_TYPE {
  AUTO_NOTIFICATION_UPDATE = 'AutoNotification Update',
  AUTO_NOTIFICATION_REQUEST = 'AutoNotification Request',
  PROJECT_COMMUNICATION = 'Project Communication',
  GENERAL_COMMUNICATION = 'General Communication',
}

export enum DOCUMENT_TYPE_UUID {
  ACORD_25 = '82813154-a313-4b6b-810d-bf6a00e0c3a5',
  ACORD_28 = '52b30ef7-892f-495c-8742-4feb4ae1db6e',
}

export enum COVERAGE_TYPE_UUID {
  GL = 'fd5a482a-68df-4a81-92af-f6865e663e5f',
  AL = 'bc71fe8f-4bbf-438c-b04e-3786158b0073',
  UL = '3ba59a79-1a79-45f4-b66c-190d390ebfaf',
  WC = '1cf78f6b-1288-40fb-8748-76567acc595f',
}
