import { Response } from 'express';
import { PdfService } from './pdf.service';
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    createPDF(data: any, res: Response): Promise<void>;
}
