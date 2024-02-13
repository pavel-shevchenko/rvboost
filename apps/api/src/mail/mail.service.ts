import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationNotify(email: string) {
    try {
      return await this.mailerService.sendMail({
        to: email,
        subject: 'Добро пожаловать на Bizdata!',
        template: './registration'
      });
    } catch (e) {
      return false;
    }
  }

  async sendPasswordRestoreLink(email: string, link: string) {
    try {
      return await this.mailerService.sendMail({
        to: email,
        subject: 'Восстановление пароля Bizdata',
        template: './password_restore_link',
        context: {
          link
        }
      });
    } catch (e) {
      return false;
    }
  }
}
