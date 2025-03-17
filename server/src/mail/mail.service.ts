import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationEmail(
    email: string,
    activationToken: string,
  ): Promise<void> {
    try {
      const activationLink = `${process.env.HOST_URL}/auth/activate?token=${activationToken}`;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Активация аккаунта',
        text: `Для активации вашего аккаунта перейдите по ссылке: ${activationLink}`,
        html: `<b>Для активации вашего аккаунта перейдите по ссылке:</b> <a href="${activationLink}">${activationLink}</a>`,
      });
    } catch (err) {
    }
  }
}
