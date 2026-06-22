import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from '../config';
import * as fs from 'fs/promises';
import * as path from 'path';
@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }
  async sendOTP(payload: { email: string; code: string }) {
    const otpTemplate = await fs.readFile(
      path.join(process.cwd(), 'src/shared/email-templates/otp.html'),
      'utf-8',
    );
    const html = otpTemplate
      .replaceAll('{{subject}}', 'Mã xác thực OTP')
      .replaceAll('{{code}}', payload.code);
    return this.resend.emails.send({
      from: 'Ecommerce <no-reply@kien.cloud>',
      to: payload.email,
      subject: 'Mã xác thực OTP',
      html,
    });
  }
}
