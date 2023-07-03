export const VENDOR_COMPLIANCE_QUEUE = 'VENDOR_COMPLIANCE_QUEUE';
export const PROJECT_ASSIGNEE_QUEUE = 'PROJECT_ASSIGNEE_QUEUE';
export const MAILER_QUEUE = 'MAILER_QUEUE';
export const ESCALATION_QUEUE = 'ESCALATION_QUEUE';
export const COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE =
  'COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE';

export const COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE =
  'COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE';

export const TEMPLATE_UPDATE_QUEUE = 'TEMPLATE_UPDATE_QUEUE';
export const AUTO_NOTIFICATION_QUEUE = 'AUTO_NOTIFICATION_QUEUE';
export const NAME_UPDATE_QUEUE = 'NAME_UPDATE_QUEUE';

export const MATERIAL_DOCS = [
  {
    name: 'Exce Summary',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Org Chart',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Hard Cost',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Soft Cost',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Rental Income',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Term Con',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'GC Contact',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'GP Contact',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'GP/Bkr Conf Call',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Investment Contact',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Insurance Req',
    vers_date: '',
    comments: '',
    status: 'R',
  },
];

export const CERTIFICATES = [
  {
    name: "Builder's Risk",
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Gen Partner - GL',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Gen Partner - Umb',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Gen Contractor - GL',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Gen Contractor - Umb',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Gen Contractor - Auto',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Gen Contractor - WC',
    vers_date: '',
    comments: '',
    status: 'R',
  },
  {
    name: 'Permanent Insurance Quote',
    vers_date: '',
    comments: '',
    status: 'R',
  },
];

export const config = {
  // FOR EVERY 1 MINUTE
  one_min: '*/1 * * * *',

  // FOR EVERY 5 MINUTE
  five_min: '*/5 * * * *',

  // EVERY 10 MINUTE
  ten_min: '*/10 * * * *',

  // EVERY 30 MINUTE
  thirty_min: '*/30 * * * *',

  // EVERY MIDNIGHT
  midnight: '0 0 * * *',
};
