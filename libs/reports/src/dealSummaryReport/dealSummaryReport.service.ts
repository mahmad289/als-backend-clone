import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DealSummaryReportCreator } from 'als/building-block/RequestableDto/Report/DealSummaryReportCreator';
import { ReportCreator } from 'als/building-block/RequestableDto/Report/ReportCreator';
import {
  DealSummary,
  MaterialDocuments,
} from 'als/building-block/utils/reportsInterface';
import {
  ClientModel as clientModel,
  ClientModelDocument,
} from 'als/manager/client/client.model';
import {
  ComplianceModel as complianceModel,
  ComplianceModelDocument,
} from 'als/manager/compliance/model/compliance.model';
import {
  ProjectModel as projectModel,
  ProjectModelDocument,
} from 'als/manager/project/project.model';
import {
  MasterRequirementModel as masterRequirementModel,
  MasterRequirementModelDocument,
} from 'als/manager/requirement-group/model/master-requirement.model';
import {
  VendorModel as vendorModel,
  VendorModelDocument,
} from 'als/manager/vendor/vendor.model';
import { Model } from 'mongoose';

import { ReportHelper } from '../reportHelper';

@Injectable()
export class DealSummaryReport {
  constructor(
    @InjectModel(projectModel.name)
    readonly ProjectModel: Model<ProjectModelDocument>,
    @InjectModel(clientModel.name)
    readonly ClientModel: Model<ClientModelDocument>,
    @InjectModel(vendorModel.name)
    readonly VendorModel: Model<VendorModelDocument>,
    @InjectModel(complianceModel.name)
    readonly ComplianceModel: Model<ComplianceModelDocument>,
    @InjectModel(masterRequirementModel.name)
    readonly MasterRequirementModel: Model<MasterRequirementModelDocument>,
    private reportHelper: ReportHelper,
  ) {}

  async create(body: DealSummaryReportCreator): Promise<any> {
    const dealSummaryResponse: any = [];
    const projects = await this.reportHelper.getProjects({
      client_id: body.client_id,
      project_ids: body.project_id,
    });

    if (projects.length !== 0) {
      for (const project of projects) {
        const contactDetails = await this.reportHelper.getContactDetails(
          project._id.toString(),
        );

        let concatenatedArray: string[] = [];
        if (project.parties_to_the_transaction) {
          concatenatedArray =
            project?.parties_to_the_transaction?.additional_insured.map(
              item => `${item.name}-(${item.type})`,
            );
        }

        const materialDocs: MaterialDocuments[] = [];
        const certificates: MaterialDocuments[] = [];
        for (const doc of project?.material_documents) {
          let date = '';
          if (doc.vers_date !== null) {
            date = new Date(doc.vers_date.toString())
              .toISOString()
              .slice(0, 10);
          }

          const obj = {
            name: doc?.name,
            vers_date: date,
            comments: doc?.comments,
            status: doc?.status,
          };

          materialDocs.push(obj);
        }

        for (const cert of project?.certificates) {
          let date = '';
          if (cert.vers_date !== null) {
            date = new Date(cert.vers_date.toString())
              .toISOString()
              .slice(0, 10);
          }

          const obj = {
            name: cert?.name,
            vers_date: date,
            comments: cert?.comments,
            status: cert?.status,
          };

          certificates.push(obj);
        }

        const deal_summary: DealSummary = {
          project_name_address: {
            property_name: project?.property_name ? project.property_name : '',
            address: project?.address_1
              ? project.address_1
              : '' + ' ' + project?.address_2
              ? project.address_2
              : '',
            city: project?.city ? project.city : '',
            state: project?.state ? project.state : '',
            zip: project?.zip ? project.zip : '',
            county: project?.county ? project.county : '',
          },
          property_details: {
            engineer: project?.deal_summary?.engineer
              ? project.deal_summary.engineer
              : ' ',
            analyst: project?.deal_summary?.analyst
              ? project.deal_summary.analyst
              : '',
            elevators: project?.deal_summary?.elevator_number
              ? project.deal_summary.elevator_number
              : '',
            pool: project?.deal_summary?.pool ? project.deal_summary.pool : '',
            est_const_period: project?.deal_summary?.est_const_period
              ? project.deal_summary.est_const_period
              : '',
            other_key_info: project?.deal_summary?.other_key_info
              ? project.deal_summary.other_key_info
              : '',
            project_description: project?.deal_summary?.project_description
              ? project.deal_summary.project_description
              : '',
            total_units: project?.deal_summary?.total_units
              ? project.deal_summary.total_units
              : '',
            playground_area: project?.deal_summary?.playground_area
              ? project.deal_summary.playground_area
              : '',
            rehab_or_new_const: project?.deal_summary?.rehab_or_new_const
              ? project.deal_summary.rehab_or_new_const
              : '',
            tenancy: project?.deal_summary?.tenancy
              ? project.deal_summary.tenancy
              : '',
            tenant_commercial: project?.deal_summary?.tenant_commercial
              ? project.deal_summary.tenant_commercial
              : '',
            total_square_feets: project?.deal_summary?.total_square_foot
              ? project.deal_summary.total_square_foot
              : '',
          },
          values_and_critical_dates: {
            bldg_pers_prop: project?.project_schedule?.bldg_pers_prop,
            bldg_rcv: project?.project_schedule?.bldg_rcv,
            closing_date: project?.project_schedule?.closing_date
              ? new Date(project?.project_schedule?.closing_date.toString())
                  .toISOString()
                  .slice(0, 10)
              : '',
            const_start_date: project?.project_schedule?.construction_start_date
              ? new Date(
                  project?.project_schedule?.construction_start_date.toString(),
                )
                  .toISOString()
                  .slice(0, 10)
              : '',
            est_perm_inst_cost:
              project?.project_schedule?.estimated_prem_ins_cost,
            estimated_construction_completion_date: project?.project_schedule
              ?.estimated_construction_completion_date
              ? new Date(
                  project.project_schedule.estimated_construction_completion_date.toString(),
                )
                  .toISOString()
                  .slice(0, 10)
              : '',
            hard_cost: project?.project_schedule?.hard_costs,
            loss_rents_12mo: project?.project_schedule?.loss_rents,
            soft_cost: project?.project_schedule?.soft_costs,
            tco_date: project?.project_schedule?.tco_date
              ? new Date(project.project_schedule.tco_date.toString())
                  .toISOString()
                  .slice(0, 10)
              : '',
            initial_comp_rpt_sent:
              project?.project_schedule?.Initial_comp_rpt_sent,
            in_constructions: project?.project_schedule?.in_constructions,
          },
          parties_to_the_trancsaction: {
            named_insured_partner:
              project?.parties_to_the_transaction?.named_insured_partnership,
            add_l_Ins: project?.parties_to_the_transaction?.add_l_Ins,
            add_l_Ins_special_member:
              project?.parties_to_the_transaction?.add_l_Ins_special_member,
            add_l_Ins_tax_credit_investment_fund:
              project?.parties_to_the_transaction
                ?.add_l_Ins_tax_credit_investment_fund,
            add_l_Ins_investment_member:
              project?.parties_to_the_transaction?.add_l_Ins_investment_member,
            inv_member: project?.parties_to_the_transaction?.inv_member,
            investor_bank: project?.parties_to_the_transaction?.investor_bank,
            add_insured_other_1: concatenatedArray[0],
            add_insured_other_2: concatenatedArray[1],
          },
          cope_and_property_exposure: {
            renovation: project?.deal_summary?.renovation,
            high_risk_area: project?.deal_summary?.high_risk_area,
            water_protection: project?.deal_summary?.water_protection,
            sinkhole_exposure: project?.deal_summary?.sinkhole_exposure,
            exterior_finish: project?.deal_summary?.exterior_finish,
            construction_type: project?.deal_summary?.construction_type,
            eq_zone: project?.deal_summary?.eq_zone,
            fire_protection_life_safety:
              project?.deal_summary?.fire_protection_safety,
            flood_zone: project?.deal_summary?.flood_zone,
            protection_fire_department:
              project?.deal_summary?.fire_protection_safety,
            roofing: project?.deal_summary?.roofing,
            structural_system: project?.deal_summary?.structural_system,
            wind_tier: project?.deal_summary?.wind_tier,
          },
          key_project_property_contacts: {
            underwriter: contactDetails['Underwriter'],
            property_manager: contactDetails['Property Manager'],
            investor_bank: project?.parties_to_the_transaction?.investor_bank,
            general_contractor: contactDetails['General Contractor'],
            general_contractor_broker:
              contactDetails['General Contractor Broker'],
            property_manager_broker: contactDetails['Property Manager Broker'],
            general_partner: contactDetails['General Partner'],
            general_partner_broker: contactDetails['General Partner Broker'],
          },
          material_documents: materialDocs,
          certificates_and_supporting: certificates,
          notes: project?.notes,
          waivers: project?.waivers,
        };

        dealSummaryResponse.push(deal_summary);
      }
    }

    return dealSummaryResponse;
  }
}
