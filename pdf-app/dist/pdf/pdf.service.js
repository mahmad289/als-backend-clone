"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_1 = require("puppeteer");
let PdfService = class PdfService {
    async createPDF(htmlResponse) {
        const browser = await puppeteer_1.default.launch({
            executablePath: 'chromium-browser',
            args: ['--no-sandbox'],
            headless: 'new',
        });
        const page = await browser.newPage();
        const css = `
      <style>
        @media print {
          /* Set spacing above and below each page */
          .page-container {
            margin-top: 20px;
            margin-bottom: 20px;
          }

          /* Add page breaks */
          .page-container:not(:last-child) {
            page-break-after: always;
          }
        }
      </style>
    `;
        await page.setContent(css + htmlResponse);
        await page.setContent(htmlResponse);
        const pdfBuffer = await page.pdf();
        await browser.close();
        return pdfBuffer;
    }
};
PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
exports.PdfService = PdfService;
//# sourceMappingURL=pdf.service.js.map