import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { render } from '@react-email/components';
import { ResetPasswordTemplate } from './templates/reset-password.template.js';
import { ConfirmationTemplate } from './templates/confirmation.template.js';

@Injectable()
export class EmailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    console.log("sen confirm email",email, token)
    const domain = this.configService.getOrThrow<string>('APPLICATION_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));
    return this.sendMail(email, 'Verification email', html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('APPLICATION_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));
    return this.sendMail(email, 'Reset password', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({ to: email, subject, html });
  }
}
