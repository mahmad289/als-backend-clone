import {
  AdditionalInsured,
  MaterialDocumentAndCertificate,
} from 'als/manager/project/project.model';
import { ObjectId } from 'mongodb';

export interface DealSummary {
  project_name_address: {
    property_name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    county: string;
  };
  property_details: {
    engineer: string;
    analyst: string;
    total_units: string;
    total_square_feets: string;
    elevators: string;
    pool: string;
    playground_area: string;
    tenancy: string;
    tenant_commercial: string;
    rehab_or_new_const: string;
    est_const_period: string;
    other_key_info: string;
    project_description: string;
  };
  values_and_critical_dates: {
    bldg_rcv: string;
    bldg_pers_prop: string;
    hard_cost: string;
    soft_cost: string;
    loss_rents_12mo: string;
    est_perm_inst_cost: string;
    closing_date: string;
    const_start_date: string;
    in_constructions: string;
    estimated_construction_completion_date: string;
    tco_date: string;
    initial_comp_rpt_sent: string;
  };
  parties_to_the_trancsaction: {
    named_insured_partner: string;
    add_l_Ins: string;
    add_l_Ins_special_member: string;
    add_l_Ins_tax_credit_investment_fund: string;
    add_l_Ins_investment_member: string;
    add_insured_other_1?: string;
    add_insured_other_2?: string;
    inv_member: string;
    investor_bank: string;
  };
  cope_and_property_exposure: {
    flood_zone: string;
    eq_zone: string;
    wind_tier: string;
    renovation: string;
    high_risk_area: string;
    construction_type: string;
    protection_fire_department: string;
    water_protection: string;
    sinkhole_exposure: string;
    structural_system: string;
    exterior_finish: string;
    roofing: string;
    fire_protection_life_safety: string;
  };
  key_project_property_contacts: {
    underwriter: [] | '';
    property_manager: [] | '';
    investor_bank: string;
    general_contractor?: [] | '';
    general_contractor_broker?: [] | '';
    property_manager_broker: [] | '';
    general_partner: [] | '';
    general_partner_broker: [] | '';
  };
  material_documents: MaterialDocuments[];
  certificates_and_supporting: MaterialDocuments[];
  notes?: string;
  waivers?: string;
}
export interface ClosingSummary {
  status_as_of: string;
  client_name: string;
  project_details: {
    name: string;
    hhc_engineer: string;
    als_analyst: string;
    general_partner?: string;
    general_contractor?: string;
    rehab_or_new_const: string;
    bldg_rcv: string;
    hard_cost: string;
    soft_cost: string;
    loss_rents_12mo: string;
    closing_date: string;
    investor: string;
  };
  comments: string[];
  material_documents: MaterialDocumentAndCertificate[];
  certificates_and_supporting: MaterialDocumentAndCertificate[];
}

export interface MaterialDocuments {
  name: string;
  vers_date: string;
  comments: string;
  status: string;
}
export interface ClosingSummaryGrid {
  name: string;
  closing_date: string;
  [key: string]: { status: string } | any;
}

interface singleMaterialDocCerts {
  name: string;
  comments: string;
  status: string;
  vers_date: string;
}
export interface PolicyExpiration {
  client: string;
  exp_date?: string;
  named_insured?: string;
  type_of_ins?: string[];
  analyst?: string;
  policy_number?: string;
  insurance_co?: string;
  broker_name?: string;
  asset_Mgr?: string;
  project_name: string;
  client_stage: string;
  coverage_type: string;
  date1?: string;
  date2?: string;
  date3?: string;
  date4?: string;

  vendor: string;
}

export interface Escalation {
  client: string;
  project_name: string;
  vendor: string;
  asset_mgr: string;
  exp_date?: string;
  type_of_ins: string[];
  named_insured?: string;
  policy_number?: string;
  coverage_type: string;
  insurance_co: string;
  esc_description?: string;
  date1?: string;
  date2?: string;
  date3?: string;
  date4?: string;
}
export interface EscalationArray {
  client: string;
  project_name: string;
  data: Escalation[];
}
interface Summary {
  hard_costs: string;
  soft_costs: string;
  loss_of_rents: string;
  rehab_new: string;
  flood_zone: string;
  eq_zone: string;
  wind_tier: string;
  replacement_cost: string;
  closing_date: string;
  investor: string;
  additional_insureds: AdditionalInsured[];
  general_contractor: string[];
  property_manager: string[];
  partnership: string[];
}

export interface FullCompliance {
  summary: Summary;
  project: string;
  cert_holder: string;
  compliance_items: {
    coverage_type: string;
    items: Omit<ComplianceItem, 'coverage_type'>[];
  }[];
  client: clientInfo | null;
  vendor: vendorInfo | null;
}

interface clientInfo {
  name: string;
}

interface vendorInfo {
  vendor_name: string;
  zip: string;
  address_1: string;
  address_2: string;
}

export interface ComplianceItem {
  coverage_type: string;
  named_insured?: string;
  master_requirement_des: string;
  required_limit: string;
  actual_limit: string;
  status: string;
  comment: string;
  expiry_date?: string;
  brokers?: string;
  policy_number?: string;
  carrier?: string;
  show?: boolean;
  waiver?: boolean;
  post_closing?: boolean;
  document_name?: string;
}
export interface NonCompliance {
  hard_costs: string;
  soft_costs: string;
  loss_of_rents: string;
  rehab_new: string;
  flood_zone: string;
  eq_zone: string;
  wind_tier: string;
  additional_insureds: string;
  project: string;
  cert_holder: string;
  compliance_items: ComplianceItem[];
}
export interface PostClosing {
  course_of_construction: string;
  requirements: string;
  required_limits: string;
  actual_limits?: string;
  comments: string;
  waiver?: boolean;
  post_closing?: boolean;
  show?: boolean;
}

export interface ComplianceItemsDetail extends ComplianceItem {
  show: boolean;
  waiver: boolean;
  post_closing: boolean;
  _id: ObjectId;
  master_requirement_detail: MasterRequiementDetail;
}

export interface MasterRequiementDetail {
  _id: ObjectId;
  coverage_type_uuid: string;
  coverage_type_name: string;
  document_type_name: string;
  requirement_description: string;
  requirement_rule: string;
  default_comment: string;
}

export interface PostClosingDetail {
  vendor_name: string;
  client_name: string;
  report_detail: Record<string, PostClosing[]>;
}

export interface CoverageSummary {
  partnership: string;
  property_name: string;
  property_address: string;
  property_city: string;
  property_state: string;
  investor: string;
  project_id: string;
  vendor_name: string;
  commercial_property_policy: string;
  commercial_property_limits: string;
  commercial_property_deductible: string;
  property_expiration_date: string;
  property_insurer: string;
  property_am_best_rating: string;
  loss_of_income: string;
  earthquake_limit: string;
  earthquake_deductible: string;
  flood_limit: string;
  flood_deductible: string;
  wind_and_hail_limit: string;
  wind_and_hail_deductible: string;
  commercial_general_liability: string;
  commercial_general_liability_occurrence: string;
  commercial_general_liability_aggregate: string;
  commercial_general_liability_aggregate_deductible: string;
  general_liability_expiration_date: string;
  general_liability_insurer: string;
  general_liability_am_best_rating: string;
  excess_commercial_general_liability: string;
  excess_commercial_general_liability_occurrence: string;
  excess_commercial_general_liability_aggregate: string;
  excess_commercial_general_liability_aggregate_deductible: string;
  excess_umbrella_expiration_date: string;
  umbrella_insurer: string;
  umbrella_am_best_rating: string;
  partnership_auto_liability: string;
  partnership_auto_liability_limit: string;
  partnership_auto_liability_deductible: string;
  partnership_auto_expiration_date: string;
  automobile_insurer: string;
  automobile_am_best_rating: string;
  property_management_general_liability: string;
  property_management_general_liability_occurrence: string;
  property_management_general_liability_aggregate: string;
  property_management_general_liability_aggregate_deductible: string;
  mgmt_general_liability_expiration_date: string;
  manager_general_liability_insurer: string;
  manager_general_liability_am_best_rating: string;
  property_management_umbrella: string;
  property_management_umbrella_occurrence: string;
  property_management_umbrella_aggregate: string;
  property_management_umbrella_aggregate_deductible: string;
  mgmt_excess_umbrella_expiration_date: string;
  manager_umbrella_insurer: string;
  manager_umbrella_am_best_rating: string;
  management_auto_liability_acord25: string;
  management_auto_liability: string;
  management_auto_liability_deductible: string;
  mgmt_auto_expiration_date: string;
  manager_automobile_insurer: string;
  manager_automobile_am_best_rating: string;
  management_workers_comp_acord25: string;
  management_workers_comp: string;
  mgmt_workers_comp_expiration_date: string;
  workers_insurer: string;
  workers_am_best_rating: string;
  management_fidelity_bond_acord25: string;
  management_fidelity_bond: string;
  management_fidelity_bond_deductible: string;
  mgmt_fidelity_crime_expiration_date: string;
  crime_insurer: string;
  crime_am_best_rating: string;
}

export interface ComplianceStatus {
  vendor_and_others: string;
  sow_overview: string;
  initial_request: string;
  follow_up_1st: string;
  follow_up_2nd: string;
  escalation_status: string;
  notes: string;
  professional_liability_coverage_limit: string;
}

export interface ComplianceStatusFinal {
  project_name: string;
  data: ComplianceStatus[];
}

export interface SupportingDocument {
  certificate: Certificate;
  gl: GL;
  auto: Auto;
  umb: UMB;
  wc: WC;
  prof_liab: ProfLiab;
  pl: PL;
}

export interface Comment {
  agreement_insurance_req: string;
  certificates: string;
  supporting_document: string;
  fortis_action: string;
}

export interface Certificate {
  gl: string;
  auto: string;
  umb: string;
  wc: string;
  pro_liab: string;
}

export interface GL {
  dec: string;
  forms_list: string;
  ai_ongoing: string;
  ai_completed: string;
  pnc: string;
  wos: string;
  noc: string;
}

export interface Auto {
  dec: string;
  forms_list: string;
}

export interface UMB {
  dec: string;
  forms_list: string;
  sch_of_underlying: string;
  pnc: string;
}

export interface WC {
  wos: string;
}

export interface ProfLiab {
  dec: string;
  forms_list: string;
  retro_date: string;
}

export interface PL {
  noc: string;
}
