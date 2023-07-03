import { faker } from '@faker-js/faker';
import { AdditionalInsured } from 'als/manager/project/project.model';
import { ObjectId } from 'mongodb';

import { ClientCreator } from '../RequestableDto/Client/ClientCreator';
import { ContactCreator } from '../RequestableDto/Contact/ContactCreator';
import { ProjectCreator } from '../RequestableDto/Project/ProjectCreator';
import { ProjectUpdate } from '../RequestableDto/Project/ProjectUpdate';
import {
  RuleDto,
  TemplateCreator,
} from '../RequestableDto/Template/TemplateCreator';
import { UserCreator } from '../RequestableDto/User/UserCreator';
import { VendorCreator } from '../RequestableDto/Vendor/VendorCreator';
import { ClientPartialResponseDto } from '../TransferableDto/Client/ClientPartial';
import { CommunicationTemplateCompleteResponseDto } from '../TransferableDto/CommunicationTemplate/CommunicationTemplate';
import { ContactPartialResponseDto } from '../TransferableDto/Contact/ContactPartial';
import { DocumentTypeResponseDto } from '../TransferableDto/DocumentType/DocumentType';
import { ProjectPartialResponseDTO } from '../TransferableDto/Project/ProjectPartial';
import { TagCompleteResponseDto } from '../TransferableDto/Tag/Tag';
import { UserCompleteResponseDto } from '../TransferableDto/User/User';
import { ADDITIONAL_INSURED_TYPE, CONTACT_TYPE_CATEGORY_ENUM } from './enum';

faker.seed(4868543);

export function createContacts(numOfContacts: number): ContactCreator[] {
  const contacts = [];
  for (let i = 0; i < numOfContacts; i++) {
    contacts.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      company_name: faker.internet.userName(),
      email: `${faker.name.firstName()}_${Date.now().toString()}@yopmail.com`,
      title: faker.name.jobTitle(),
      phone_number: faker.phone.number(),

      address_1: faker.address.streetAddress(),
      address_2: faker.address.secondaryAddress(),
      address_3: faker.address.street(),
      city: faker.address.city(),
      zip: faker.address.zipCode(),

      state: faker.address.state(),
      fax: faker.phone.imei(),
      direct: faker.helpers.arrayElement(['direct1', 'direct2']),
      mobile: faker.phone.number('+48 91 ### ## ##'),
      type: faker.helpers.arrayElement([
        'Underwriter',
        'Lender',
        'Property Manager',
        'Property manager',
        'Broker',
        'General Partner',
        'General Partner Broker',
        'General Contractor',
        'General Contractor Broker',
        'Broker',
        'Insurance Company',
        'Client',
        'Risk Manager',
        'Asset Manager',
        'Sales Manager',
        'Relationship Manager',
      ]),
      contact_type: faker.helpers.arrayElement([
        CONTACT_TYPE_CATEGORY_ENUM.CLIENT,
        CONTACT_TYPE_CATEGORY_ENUM.VENDOR,
        CONTACT_TYPE_CATEGORY_ENUM.PROJECT,
      ]),
    });
  }

  return contacts;
}

export function createUsers(numOfUsers: number): UserCreator[] {
  const alsUsers = [];
  for (let i = 0; i < numOfUsers; i++) {
    alsUsers.push({
      username: faker.internet.userName(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      role: 'admin',
      phone_number: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }

  return alsUsers;
}

export function createClients(numOfUsers: number): ClientCreator[] {
  const clients = [];
  for (let i = 0; i < numOfUsers; i++) {
    clients.push({
      name: faker.internet.userName(),
      client_type: faker.helpers.arrayElement([
        'Real Estate & Development',
        'Banking',
      ]),
      address_1: faker.address.street(),
      address_2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      zip: faker.address.zipCode(),
      state: faker.address.state(),
      contacts_id: [],
      company_manager: new ObjectId(),
    });
  }

  return clients;
}

export function createVendors(numOfUsers: number): VendorCreator[] {
  const vendors = [];
  for (let i = 0; i < numOfUsers; i++) {
    vendors.push({
      username: faker.internet.userName(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      address_1: faker.address.street(),
      address_2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      vendor_name: faker.name.fullName(),
      alias: faker.random.alphaNumeric(3),
      phone_number: faker.phone.number(),
      contacts_id: [],
      tags: [],
      scope_of_work: faker.name.jobTitle(),
      title: faker.name.jobTitle(),
      direct_dial: Number(faker.random.numeric(4)),
    });
  }

  return vendors;
}

export function createProjects(
  numOfProjects: number,
  clientArray: ClientPartialResponseDto[],
  managerArray: ContactPartialResponseDto[],
): ProjectCreator[] {
  const projects = [];
  for (let i = 0; i < numOfProjects; i++) {
    const clientData = faker.helpers.arrayElement(clientArray);
    const managerData = faker.helpers.arrayElement(managerArray);
    projects.push({
      client: {
        client_id: clientData._id,
        name: clientData.name,
      },
      name: faker.name.jobTitle(),
      address_1: faker.address.street(),
      address_2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      county: faker.address.county(),
      property_name: faker.name.jobTitle(),
      manager: {
        manager_id: managerData._id,
        name: `${managerData.first_name} ${managerData.last_name}`,
      },
      documents: [
        {
          type: 'executive_summary',
          documents: [
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
          ],
        },
        {
          type: 'endorsements',
          documents: [
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
          ],
        },
        {
          type: 'insurance_requirement',
          documents: [
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
          ],
        },
        {
          type: 'risk_report',
          documents: [
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
            {
              name: faker.helpers.arrayElement([
                'Company Profile',
                'ALS 2.0',
                'Project List',
              ]),
              key: faker.random.alphaNumeric(10),
            },
          ],
        },
      ],
    });
  }

  return projects;
}

export function createProjectUpdate(): ProjectUpdate {
  return {
    certificate_holders: [
      {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address_1: faker.address.street(),
        address_2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode(),
      },
      {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address_1: faker.address.street(),
        address_2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode(),
      },
      {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address_1: faker.address.street(),
        address_2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode(),
      },
    ],
    project_schedule: {
      closing_date: faker.date.future(),
      construction_start_date: faker.date.future(),
      estimated_construction_completion_date: faker.date.future(),
      tco_date: faker.date.future(),
      bldg_rcv: faker.random.numeric(5).toString(),
      bldg_pers_prop: faker.random.numeric(5).toString(),
      hard_costs: faker.random.numeric(5).toString(),
      soft_costs: faker.random.numeric(5).toString(),
      loss_rents: faker.random.numeric(5).toString(),
      estimated_prem_ins_cost: faker.random.numeric(5).toString(),
      in_constructions: faker.helpers.arrayElement(['Yes', 'No']),
      Initial_comp_rpt_sent: faker.helpers.arrayElement(['Yes', 'No']),
      replacement_cost: faker.random.numeric(5).toString(),
    },
    parties_to_the_transaction: {
      named_insured_partnership: faker.name.jobTitle(),
      add_l_Ins: faker.name.jobTitle(),
      add_l_Ins_special_member: faker.name.jobTitle(),
      add_l_Ins_tax_credit_investment_fund: faker.name.jobTitle(),
      add_l_Ins_investment_member: faker.name.jobTitle(),
      investor_bank: faker.name.jobTitle(),
      inv_member: faker.name.jobTitle(),
      additional_insured: createAdditionInsured(),
    },
    deal_summary: {
      client_stage: faker.helpers.arrayElement([
        'Pre-Construction',
        'Construction',
        'Lease Up',
        'Stabilized',
        'Hold',
        'Sold',
      ]),
      engineer: faker.name.fullName(),
      analyst: faker.name.fullName(),
      renovation: faker.helpers.arrayElement(['Yes', 'No']),
      high_risk_area: faker.helpers.arrayElement(['Yes', 'No']),
      sinkhole_exposure: faker.helpers.arrayElement(['Yes', 'No']),
      exterior_finish: faker.helpers.arrayElement(['Brick', 'Wood', 'Stucco']),
      water_protection: faker.helpers.arrayElement(['Yes', 'No']),
      playground_area: faker.random.numeric(5).toString(),
      total_units: faker.random.numeric(5).toString(),
      total_square_foot: faker.random.numeric(5).toString(),
      elevator_number: faker.random.numeric(5).toString(),
      pool: faker.random.numeric(5).toString(),
      tenancy: faker.helpers.arrayElement(['Residential', 'Commercial']),
      tenant_number: faker.random.numeric(3).toString(),
      tenant_commercial: faker.random.numeric(3).toString(),
      rehab_or_new_const: faker.helpers.arrayElement([
        'Rehab',
        'New Construction',
      ]),
      est_const_period: faker.random.numeric(2).toString(),
      project_description: faker.lorem.paragraph(),
      other_key_info: faker.lorem.paragraph(),
      flood_zone: faker.helpers.arrayElement(['A', 'B', 'C', 'X']),
      eq_zone: faker.helpers.arrayElement(['A', 'B', 'C', 'X']),
      wind_tier: faker.helpers.arrayElement(['1', '2', '3', '4']),
      construction_type: faker.helpers.arrayElement([
        'Wood',
        'Steel',
        'Concrete',
      ]),
      protection: faker.helpers.arrayElement(['Sprinkler', 'Non-Sprinkler']),
      structural_system: faker.helpers.arrayElement([
        'Concrete',
        'Steel',
        'Wood',
      ]),
      roofing: faker.helpers.arrayElement(['Asphalt', 'Metal', 'Tile']),
      fire_protection_safety: faker.helpers.arrayElement(['Yes', 'No']),
    },
  };
}

export interface IAssignedVendor {
  vendor_id: ObjectId;
  vendor_name: string;
  requirement_group_id: ObjectId;
  requirement_group_name: string;
}

export interface IAssignedClient {
  client_id: ObjectId;
  name: string;
}

export interface IAssignedManager {
  manager_id: ObjectId;
  name: string;
}

export function createCoiTemplateData(
  numberOfTemplate: number,
  requirementListId: ObjectId[],
  templateType: 'acord25' | 'acord28',
): TemplateCreator[] {
  const templates = [];
  for (let i = 0; i < numberOfTemplate; i++) {
    const template = {
      template_name: `${faker.helpers
        .unique(faker.commerce.productName)
        .split(' ')
        .join('_')}_${Date.now().toString()}`,
      rules: createRules(requirementListId),
      type: templateType === 'acord25' ? 'Acord 25' : 'Acord 28',
    };

    templates.push(template);
  }

  return templates;
}

function createAdditionInsured(): AdditionalInsured[] {
  const additionalInsured = [];
  const count = Math.floor(Math.random() * 4) + 1; // 1 to 4  rules
  for (let i = 0; i < count; i++) {
    const insured = {
      name: faker.company.name(),
      type: faker.helpers.arrayElement(Object.values(ADDITIONAL_INSURED_TYPE)),
    };

    additionalInsured.push(insured);
  }

  return additionalInsured;
}

function createRules(requirementListId: ObjectId[]): RuleDto[] {
  const rules = [];
  const count = Math.floor(Math.random() * 4) + 1; // 1 to 4  rules
  for (let i = 0; i < count; i++) {
    const rule = {
      name: faker.company.name(),
      master_requirement_id: faker.helpers.arrayElement(requirementListId),
      condition: faker.helpers.arrayElement([
        'Required',
        'Greater than',
        'Greater than or equal',
        'Less than',
      ]),
      value: faker.random.numeric(5),
      message: faker.commerce.productDescription(),
      is_enabled: faker.helpers.arrayElement([true, false]),
    };

    rules.push(rule);
  }

  return rules;
}

export function createAutoNotifications(
  numberOfAutoNotifications: number,
  // userArray: UserCompleteResponseDto[],
  // templateArray: CommunicationTemplateCompleteResponseDto[],
) {
  const autoNotifications = [];
  for (let i = 0; i < numberOfAutoNotifications; i++) {
    autoNotifications.push({
      name: faker.company.name(),
      type: faker.helpers.arrayElement(['update', 'request']),
    });
  }

  return autoNotifications;
}

export function createAutoNotificationsRequest(
  userArray: UserCompleteResponseDto[],
  templateArray: CommunicationTemplateCompleteResponseDto[],
  tags: TagCompleteResponseDto[],
  projects: ProjectPartialResponseDTO[],
) {
  const rnd = Math.floor(Math.random() * (8 - 3 + 1) + 3);
  const templateData = faker.helpers.arrayElement(templateArray);
  const userData = faker.helpers.arrayElement(userArray);
  const tagData = faker.helpers.arrayElements(tags, rnd);
  const projectData = faker.helpers.arrayElement(projects);
  const tagIds = tagData.map(tag => tag._id);

  return {
    days: parseInt(faker.random.numeric(1)),
    schedule_type: faker.helpers.arrayElement(['every']),
    applies_to: tagIds,
    compliance_statuses: faker.helpers.arrayElements([
      'compliant',
      'not_compliant_not_critical',
      'not_compliant_critical',
    ]),
    template: {
      template_id: templateData._id,
      template_name: templateData.template_name,
    },
    sender: userData._id,
    project_id: projectData._id,
    active: faker.helpers.arrayElement([false]),
    company_manager: faker.helpers.arrayElement([true, false]),
    producer: faker.helpers.arrayElement([true, false]),
    count: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7]),
  };
}

export function createAutoNotificationsUpdate(
  userArray: UserCompleteResponseDto[],
  templateArray: CommunicationTemplateCompleteResponseDto[],
  documentTypeArray: DocumentTypeResponseDto[],
  tags: TagCompleteResponseDto[],
  projects: ProjectPartialResponseDTO[],
) {
  const rnd = Math.floor(Math.random() * (8 - 3 + 1) + 3);
  const templateData = faker.helpers.arrayElement(templateArray);
  const userData = faker.helpers.arrayElement(userArray);
  const projectData = faker.helpers.arrayElement(projects);
  const tagData = faker.helpers.arrayElements(tags, rnd);
  const tagIds = tagData.map(tag => tag._id);
  const documentTypeData = faker.helpers.arrayElements(documentTypeArray, rnd);

  return {
    days: parseInt(faker.random.numeric(1)),
    schedule_type: faker.helpers.arrayElement(['before', 'after']),
    applies_to: tagIds,
    compliance_statuses: faker.helpers.arrayElements([
      'compliant',
      'not_compliant_not_critical',
      'not_compliant_critical',
    ]),
    documents: documentTypeData.map(doc => doc.uuid),
    template: {
      template_id: templateData._id,
      template_name: templateData.template_name,
    },
    sender: userData._id,
    project_id: projectData._id,
    active: faker.helpers.arrayElement([false]),
    company_manager: faker.helpers.arrayElement([true, false]),
    producer: faker.helpers.arrayElement([true, false]),
  };
}
