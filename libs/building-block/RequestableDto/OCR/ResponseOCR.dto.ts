export class ResponseOCR {
  data: {
    _id: string;
    compliance_id: string;
    document_type: string;
    extracted_data: {
      [key: string]: any;
    };
  };
}
