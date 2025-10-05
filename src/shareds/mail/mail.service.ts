import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.emailUser,
        pass: this.configService.emailPassword,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const template = fs.readFileSync(
      path.join(__dirname, '../../templates/otp.html'),
      'utf-8',
    );
    const html = template.replace('{{otp}}', otp);
    await this.transporter.sendMail({
      from: this.configService.emailUser,
      to: email,
      subject: 'OTP Verification',
      html,
    });
  }

  async sendResetPasswordOtp(email: string, otp: string): Promise<void> {
    const template = fs.readFileSync(
      path.join(__dirname, '../../templates/reset-password-otp.html'),
      'utf-8',
    );
    const html = template.replace('{{otp}}', otp);
    await this.transporter.sendMail({
      from: this.configService.emailUser,
      to: email,
      subject: 'Reset Password OTP',
      html,
    });
  }
}
