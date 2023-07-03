import { ReportCreator } from 'als/building-block/RequestableDto/Report/ReportCreator';

export abstract class IReportService {
  abstract create(body: ReportCreator): Promise<unknown>;
}
