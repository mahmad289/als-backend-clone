import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async createPDF(htmlResponse: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox'],
      headless: 'new',
    });

    const page = await browser.newPage();
    /*
    // Only if we have to insert page breaks like this, Currently we are not using this!
    <div class="page-container">
      <!-- Content of the first page -->
    </div>
    <div class="page-container">
      <!-- Content of the second page -->
    </div>
    */
    // Add CSS styles for spacing and page breaks
    // Not being used, Not Needed
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
    // await page.setContent(css + htmlResponse);

    await page.setContent(htmlResponse);

    await page.evaluate(() => {
      const footer = document.createElement('div');
      footer.style.position = 'fixed';
      footer.style.bottom = '0';
      footer.style.left = '0';
      footer.style.height = '50px';
      footer.style.textAlign = 'right';
      footer.style.fontSize = '12px';
      footer.style.lineHeight = '50px';

      const body = document.querySelector('body');
      body?.appendChild(footer);
    });

    // Adjust any additional settings or configurations as needed

    const formattedDate = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      printBackground: true,
      footerTemplate: `
      <table style="width:100%; table-layout:fixed">
      <tr>
      <td><div style="font-size: 8px; text-align: left; margin-left: 10px;">${formattedDate}</div></td>
      <td><div style="font-size: 8px; color: black; margin-left:75px">
      <span class="pageNumber"></span>&nbsp;/&nbsp;<span class="totalPages"></span>
    </div></td>
      <td><div style="font-size: 8px; text-align: right; margin-right:10px">Prepared by Risk Comply
      </div></td>
      </tr>
      </table>
     
  
`,
      margin: { top: '4mm', bottom: '43px' },
    });

    await browser.close();

    return pdfBuffer;
  }
}
