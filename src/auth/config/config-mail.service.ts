// mailer.service.ts
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { config } from './constants'; // Importez les informations de configuration de messagerie

@Injectable()
export class MailerService {
  async sendMail(email: string, subject: string, text: string ): Promise<void> {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: config.mail_user, // Utilisez les informations de configuration de messagerie
        pass: config.mail_pass,
      },
      port: 587,
      secure: false, // true pour SSL/TLS, false pour STARTTLS
    });

    await transporter.sendMail({
      from: `noreply <${config.mail_user}>`,
      to: email,
      subject: subject,
      html: text,
     
    });
  }

  async sendMailWithAttachment(email: string, subject: string, text: string, attachment: any): Promise<void> {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: config.mail_user, // Utilisez les informations de configuration de messagerie
            pass: config.mail_pass,
        },
    });

    await transporter.sendMail({
        from: `noreply <${config.mail_user}>`,
        to: email,
        subject: subject,
        html: text,
        attachments: [{
          filename: attachment.filename, // Nom de la pièce jointe
          content: attachment.content, // Contenu de la pièce jointe (Buffer)
        }],
    });
  }
}



  


/**
 * // mailer.service.ts
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { config } from './constants'; // Importez les informations de configuration de messagerie

@Injectable()
export class MailerService {
  async sendMail(email: string, subject: string, text: string): Promise<void> {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: config.mail_user, // Utilisez les informations de configuration de messagerie
        pass: config.mail_pass,
      },
    });

    await transporter.sendMail({
      from: `noreply <${config.mail_user}>`,
      to: email,
      subject: subject,
      html: text,
    });
  }


  
}

 */