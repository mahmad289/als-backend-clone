import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { MailCreator } from './MailCreator';

@Injectable()
export class EmailService {
  logger = new Logger();
  private transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_SMTP_PORT as string),
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendEmail(options: MailCreator) {
    const { to, subject } = options;
    let { html } = options;
    const header =
      '<div style="width:100%;"><img style="margin:auto; display:flex;" src="https://i.ibb.co/kXkx6Vz/Logo-Black.png" alt="logo" /></div>';

    html = header + html;
    try {
      const message = {
        from: process.env.EMAIL_USERNAME,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(message);
    } catch (err) {
      Logger.log('Error sending email...');
      // We need to throw an error here if we are using Queue
      // throw new Error(`Error => ${err}`);
    }
  }
}
