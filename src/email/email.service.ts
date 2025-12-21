import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { accountRegistrationTemplate } from './templates/account-registration';
import { User } from 'generated/prisma/client';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class EmailService {
  constructor(private readonly otpService: OtpService) {}

  async sendEmail(mailOptions: BrevoMailPayload) {
    const response = await axios.post<BrevoEmailResponse>(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: `${process.env.EMAIL}`, name: 'TransitFlow' },
        to: [{ email: mailOptions.email }],
        subject: mailOptions.subject,
        htmlContent: mailOptions.html,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
  }

  async sendAccountVerificationEmail(user: User, otp: string) {
    // await this.otpService.verifyOtp(user.id, otp);
    const template = accountRegistrationTemplate(otp);
    await this.sendEmail({
      email: user.email,
      html: template,
      subject: 'Account Verification',
    });
  }
}
