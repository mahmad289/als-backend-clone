import { DOCUMENT_TYPE_UUID } from './enum';
import { ComplianceItemsDetail, PostClosing } from './reportsInterface';

export function postClosing_CoverageType(
  compliance_item: ComplianceItemsDetail[],
) {
  const res = compliance_item.reduce(
    (result: Record<string, PostClosing[]>, item: any) => {
      const key = item.master_requirement_detail.coverage_type_name;
      if (!result[key]) {
        result[key] = [];
      }

      const postClosing: PostClosing = {
        course_of_construction:
          item.master_requirement_detail.coverage_type_name,
        requirements: item.master_requirement_detail.requirement_description,
        required_limits: item.required_limit,
        actual_limits: item.actual_limit,
        comments: item.comment,
        waiver: item.waiver ?? false,
        post_closing: item.post_closing ?? false,
        show: item.show ?? false,
      };

      result[key].push(postClosing);

      return result;
    },
    {},
  );

  return res;
}

export function coiScheduleOfInsuranceHelper(complianceResponse: any) {
  const coiResponse: any = [];

  for (const compliance of complianceResponse) {
    const result = compliance.template_items.reduce((acc: any, item: any) => {
      const key = `${item.master_requirement.coverage_type_name}`;
      if (!acc[key]) {
        acc[key] = {
          name: item.master_requirement?.coverage_type_name,
          vendor_name: compliance.vendor_name,
          project_name: compliance.project_name,
          client_name: compliance.client_name,
          items: [],
        };
      }

      if (item.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_25) {
        const insurers = [];
        if (compliance.acord_25_ocr_data?.extracted_data.insurer_A) {
          insurers.push(compliance.acord_25_ocr_data?.extracted_data.insurer_A);
        }

        if (compliance.acord_25_ocr_data?.extracted_data.insurer_B) {
          insurers.push(compliance.acord_25_ocr_data?.extracted_data.insurer_B);
        }

        if (compliance.acord_25_ocr_data?.extracted_data.insurer_C) {
          insurers.push(compliance.acord_25_ocr_data?.extracted_data.insurer_C);
        }

        if (compliance.acord_25_ocr_data?.extracted_data.insurer_D) {
          insurers.push(compliance.acord_25_ocr_data?.extracted_data.insurer_D);
        }

        if (compliance.acord_25_ocr_data?.extracted_data.insurer_E) {
          insurers.push(compliance.acord_25_ocr_data?.extracted_data.insurer_E);
        }

        if (compliance.acord_25_ocr_data?.extracted_data.insurer_F) {
          insurers.push(compliance.acord_25_ocr_data?.extracted_data.insurer_F);
        }

        acc[key].items.push({
          default_comment: item.master_requirement?.default_comment,
          actual_limit: item?.actual_limit,
          requirement_description:
            item.master_requirement?.requirement_description,
          carrier:
            insurers.length === 1
              ? insurers[0]
              : `Various (${insurers.join(', ')})`,
        });
      } else if (item.document_type_uuid === DOCUMENT_TYPE_UUID.ACORD_28) {
        acc[key].items.push({
          default_comment: item.master_requirement?.default_comment,
          actual_limit: item?.actual_limit,
          requirement_description:
            item.master_requirement?.requirement_description,
          policy_number:
            compliance.acord_28_ocr_data?.extracted_data.policy_number,
          carrier: compliance.acord_28_ocr_data?.extracted_data.company_name,
          named_insured:
            compliance.acord_28_ocr_data?.extracted_data.named_insured,
        });
      } else {
        acc[key].items.push({
          default_comment: item.master_requirement?.default_comment,
          actual_limit: item?.actual_limit,
          requirement_description:
            item.master_requirement?.requirement_description,
        });
      }

      return acc;
    }, {});

    // add policy number, carrier, named insured outside the items array
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        const element = result[key];
        if (element.items.length > 0) {
          if (element.items[0].policy_number) {
            element.policy_number = element.items[0].policy_number;
            delete element.items[0].policy_number;
          }

          if (element.items[0].carrier) {
            element.carrier = element.items[0].carrier;
            delete element.items[0].carrier;
          }

          if (element.items[0].named_insured) {
            element.named_insured = element.items[0].named_insured;
            delete element.items[0].named_insured;
          }
        }
      }
    }

    const resultArray = Object.values(result);
    coiResponse.push(...resultArray);
  }

  return coiResponse;
}
