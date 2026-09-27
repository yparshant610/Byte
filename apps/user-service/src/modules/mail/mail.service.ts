import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const service = this.configService.get<string>('SMTP_SERVICE');
    const host = this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com');
    const port = Number(this.configService.get<number>('SMTP_PORT', 465));
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (user && pass) {
      const isGmail = service === 'gmail' || (host && host.includes('gmail'));
      const transportOptions: any = isGmail
        ? {
            service: 'gmail',
            auth: {
              user,
              pass,
            },
          }
        : {
            host,
            port,
            secure: port === 465,
            auth: {
              user,
              pass,
            },
          };

      this.transporter = nodemailer.createTransport(transportOptions);
      this.logger.log(`SMTP Mailer initialized via ${isGmail ? 'Gmail Service' : `${host}:${port}`}`);
    } else {
      this.logger.warn(
        'SMTP credentials not fully configured (SMTP_USER, SMTP_PASS). Outgoing emails will be logged to console.',
      );
    }
  }

  async sendOtpEmail(toEmail: string, otp: string): Promise<boolean> {
    const from = this.configService.get<string>('SMTP_FROM', 'Food Bytes <no-reply@foodbytes.app>');
    const subject = `Your Food Bytes Verification Code: ${otp}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fcf9f8; margin: 0; padding: 24px; color: #1c1b1b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { background: #FF1E38; padding: 32px 24px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 32px 28px; text-align: center; }
          .otp-badge { display: inline-block; background: #fff0f2; border: 2px dashed #FF1E38; color: #FF1E38; font-size: 34px; font-weight: 800; letter-spacing: 6px; padding: 14px 28px; border-radius: 16px; margin: 24px 0; }
          .footer { padding: 20px 24px; font-size: 12px; color: #71717a; text-align: center; border-top: 1px solid #f0edec; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Food Bytes 🍔</h1>
          </div>
          <div class="content">
            <h2 style="margin-top: 0; font-size: 20px;">Verify Your Email</h2>
            <p style="color: #5e3f3d; font-size: 15px; line-height: 1.5;">
              Use the single-use code below to complete your sign-up. This code is valid for <strong>5 minutes</strong>.
            </p>
            <div class="otp-badge">${otp}</div>
            <p style="color: #71717a; font-size: 13px;">If you did not request this verification, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Food Bytes Ecosystem. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    if (!this.transporter) {
      this.logger.log(`[MOCK EMAIL DISPATCH] To: ${toEmail} | OTP Code: ${otp}`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from,
        to: toEmail,
        subject,
        html,
        text: `Your Food Bytes verification OTP is: ${otp}. It expires in 5 minutes.`,
      });
      this.logger.log(`Verification OTP email successfully sent to ${toEmail}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${toEmail}: ${err.message}`, err.stack);
      return false;
    }
  }
}
