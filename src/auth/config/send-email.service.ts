import { Injectable } from '@nestjs/common';
import { MailerService } from './config-mail.service';
import { UserDto } from 'src/user/dto/user.dto';
import { config } from './constants';
import { TaskDto } from 'src/task/dto/task.dto';

import { Task } from 'src/task/entities/task.entity';
import { RepetitiveTask } from 'src/repetitive-task/entities/repetitive-task.entity';
import { Reminder } from 'src/reminder/entities/reminder.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SendEmailService {




    //config service mail smtp gmail
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordChangedEmail(email: string): Promise<void> {
    const htmlContent = `
      <div style="text-align: center;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 90%; height: 160px;">
        <h1>Votre mot de passe a été changé avec succès!</h1>
        <p>Votre mot de passe a été modifié avec succès. Si vous n'avez pas effectué cette modification, veuillez contacter le support.</p>
      </div>
    `;

    await this.mailerService.sendMail(
      email,
      'Changement de mot de passe',
      htmlContent
    );
  }


  async sendWelcomeEmail(userDto: UserDto, resetToken: string): Promise<void> {
    const resetPasswordLink = `${config.APP_URL}/reset-password/${resetToken}`; // Créez le lien de réinitialisation de mot de passe

    const htmlContent = `
      <div style="text-align: center;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 90%; height: 160px;">
        <h1 style="color: #333;">Bienvenue ${userDto.prenom} ${userDto.nom}!</h1>
        <p>Vous êtes inscrit et pouvez maintenant modifier votre mot de passe pour accéder à votre compte.</p>
        <p>Votre rôle dans notre application est: ${userDto.role}</p>

        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p>Ce lien expirera dans 2 heures.</p> 
        <a href="${resetPasswordLink}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>

      </div>
    `;
    await this.mailerService.sendMail(userDto.email, 'Bienvenue sur notre application', htmlContent);
  }


  async sendAccountDeactivatedEmail(userDto: UserDto): Promise<void> {
    const htmlContent = `
      <div style="text-align: center;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 90%; height: 160px;">
        <h1 style="color: #333;">Bonjour ${userDto.prenom} ${userDto.nom}!</h1>
        <p>Votre compte a été désactivé. Veuillez contacter le support pour plus d'informations.</p>
        <p>Merci!</p>
      </div>
    `;
     await this.mailerService.sendMail(userDto.email, 'Compte désactivé', htmlContent);
  }




  async sendPasswordResetEmail(userDto: UserDto, resetToken: string): Promise<void> {
    const resetPasswordLink = `${config.APP_URL}/reset-password/${resetToken}`; // Créez le lien de réinitialisation de mot de passe
    const htmlContent = `
      <div style="text-align: center;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 90%; height: 160px;">
        
        <h1 style="color: #333;">Bienvenue ${userDto.prenom} ${userDto.nom}!</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      
        <p>Ce lien expirera dans 2 heures.</p> 
  
        <a href="${resetPasswordLink}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
      </div>
    `;
    await this.mailerService.sendMail(userDto.email, 'Oublier mot de passe', htmlContent);
  }
  


  async sendTaskCreatedEmail(email: string, taskData: TaskDto ): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
          <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;">Nouvelle tâche créée</h1>

          <div style="text-align: left; padding-left: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${taskData.titre}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${taskData.description}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Status:</strong> ${taskData.status}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Date limite:</strong> ${taskData.deadline}</p>
          </div>
        </div>
      </div>
    `;
  
    await this.mailerService.sendMail(email, 'Nouvelle tâche créée', htmlContent );
}


  async sendTaskUpdatedEmail(email: string, taskData: TaskDto): Promise<void> {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
      <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
      <h1 style="color: #333; margin-bottom: 20px;>Tâche mise à jour</h1>
        
        
        <div style="text-align: left; padding-left: 20px;">
        <p>La tâche suivante a été mise à jour :</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${taskData.titre}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${taskData.description}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Status:</strong> ${taskData.status}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Date limite:</strong> ${taskData.deadline}</p>
      </div>
      </div>
      </div>
    `;

    await this.mailerService.sendMail(email, 'Tâche mise à jour', htmlContent);
  }

  async sendTaskDeletedEmail(email: string, deletedTask: any ): Promise<void> {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
    <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;>Tâche supprimée</h1>
        <p>La tâche suivante a été supprimée :</p>
        <div style="text-align: left; padding-left: 20px;">
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${deletedTask.titre}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${deletedTask.description}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Status:</strong> ${deletedTask.status}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Date limite:</strong> ${deletedTask.deadline}</p>
      </div>
      </div>
      </div>
    `;

    

    await this.mailerService.sendMail(email, 'Tâche supprimée', htmlContent);
  }

  async sendActivatedTask(email: string, taskToDeactivate: Task) {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
    <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
    <h1 style="color: #333; margin-bottom: 20px;">Tâche activée</h1>
    <p>La tâche suivante a été activée :</p>
        <div style="text-align: left; padding-left: 20px;">
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${taskToDeactivate.titre}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${taskToDeactivate.description}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Status:</strong> ${taskToDeactivate.status}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Date limite:</strong> ${taskToDeactivate.deadline}</p>
      </div>
      </div>
      </div>
    `;

    

    await this.mailerService.sendMail(email, 'Tâche supprimée', htmlContent);
  }

  async sendCollaborationEmail(email: string, taskData: TaskDto ): Promise<void> {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
    <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
            <h1 style="color: #333; margin-bottom: 20px;>Nouvelle collaboration sur une tâche</h1>
            <
            <div style="text-align: left; padding-left: 20px;">
             <p>Vous avez été assigné à une nouvelle tâche :</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${taskData.titre}</p>
            <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong>${taskData.description}</p>
            <p style="font-size: 16px; margin-bottom: 10px;">Date limite: ${taskData.deadline}</p>
            </div>
            <p>Merci!</p>
        </div>
        </div>
        </div>
    `;

    await this.mailerService.sendMail(email, 'Nouvelle collaboration sur une tâche', htmlContent );
}

async sendCollaborationEmailWithAttachment(email: string, task: Task, attachmentData: any, attachmentName: any) {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
  <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
          <h1 style="color: #333; margin-bottom: 20px;>Nouvelle collaboration sur une tâche</h1>
          <
          <div style="text-align: left; padding-left: 20px;">
           <p>Vous avez été assigné à une nouvelle tâche :</p>
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${task.titre}</p>
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong>${task.description}</p>
          <p style="font-size: 16px; margin-bottom: 10px;">Date limite: ${task.deadline}</p>
          </div>
          <p>Merci!</p>
      </div>
      </div>
      </div>
  `;
   // Construisez la pièce jointe à envoyer avec l'e-mail
   const mailAttachment = {
    filename: attachmentName, // Nom de la pièce jointe
    content: attachmentData, // Contenu de la pièce jointe (Buffer)
  };

  await this.mailerService.sendMailWithAttachment(email, 'Nouvelle collaboration sur une tâche', htmlContent,mailAttachment );
}



//envoyer email avec joindre fichier 
async sendEmailFunction(email: string, subject: string, titre: string, description: string, attachmentData: Buffer, attachmentName: string, nom: string, prenom: string): Promise<void> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">${subject}</h1>

        <p style="font-size: 16px; margin-bottom: 10px;">Bonjour ${nom} ${prenom},</p>
        <p style="font-size: 16px; margin-bottom: 10px;">Vous recevez ce mail de l'administrateur et il contient les informations suivantes :</p>

        <div style="text-align: left; padding-left: 20px;">
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${titre}</p>
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${description}</p>
        </div>
      </div>
    </div>
  `;
  
  // Construisez la pièce jointe à envoyer avec l'e-mail
  const mailAttachment = {
    filename: attachmentName, // Nom de la pièce jointe
    content: attachmentData, // Contenu de la pièce jointe (Buffer)
  };

  await this.mailerService.sendMailWithAttachment(email, subject, htmlContent, mailAttachment);
}



// envoyer email sans joindre fichier
async sendEmailFunctionWithOutAttachment(email: string, subject: string, titre: string, description : string ,  nom: string, prenom: string): Promise<void> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">${subject}</h1>
        <p style="font-size: 16px; margin-bottom: 10px;">Bonjour ${nom} ${prenom},</p>
        <p style="font-size: 16px; margin-bottom: 10px;">Vous recevez ce mail de l'administrateur et il contient les informations suivantes :</p>
        <div style="text-align: left; padding-left: 20px;">
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${titre}</p>
          <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${description}</p>
        </div>
      </div>
    </div>
  `;
  


  await this.mailerService.sendMail(email, subject, htmlContent);
}


//cree tache avec piece jointe 
/*async sendTaskCreatedEmailWithAttachment(email: string, task: Task, attachmentData: any, attachmentName: any) {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
      <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
      <h1 style="color: #333; margin-bottom: 20px;">Nouvelle tâche créée</h1>

      <div style="text-align: left; padding-left: 20px;">
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Titre:</strong> ${task.titre}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Description:</strong> ${task.description}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Status:</strong> ${task.status || 'En attente'} </p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Date limite:</strong> ${task.deadline}</p>
      </div>
    </div>
  </div>
`;
  // Construisez la pièce jointe à envoyer avec l'e-mail
  const mailAttachment = {
    filename: attachmentName, // Nom de la pièce jointe
    content: attachmentData, // Contenu de la pièce jointe (Buffer)
  };

await this.mailerService.sendMailWithAttachment(email, 'Nouvelle tâche créée', htmlContent , mailAttachment );
}
*/


async sendPublicationEmail(email: string, repetitiveTask: RepetitiveTask): Promise<void> {
  // Contenu HTML de l'e-mail
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
    <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
      <h1>Nouvelle publication disponible!</h1>
      <p>Une nouvelle publication est maintenant disponible.</p>
      <p>Date de publication : ${repetitiveTask.datePublication}</p>
      <p>Titre : ${repetitiveTask.titre}</p>
      <p>Description : ${repetitiveTask.description}</p>
    </div>
    </div>
    </div>
  `;

  // Envoyer l'e-mail HTML
  await this.mailerService.sendMail(email, 'Nouvelle publication', htmlContent);
}



async sendReminderEmail(user: User, reminder: Reminder, task: Task): Promise<void> {
  // Récupérer les détails de la tâche
  const { titre, description, deadline } = task;

  // Contenu HTML de l'e-mail
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 40px;">
        <img src="https://urlz.fr/pWAc" alt="ISIMS Logo" style="width: 100%; max-width: 100%; height: auto; margin-bottom: 20px;">
        <p>Bonjour ${user.nom} ${user.prenom},</p>
        <p>Vous avez un rappel pour la tâche suivante :</p>
        <p>Titre de la tâche : ${titre}</p>
        <p>Description de la tâche : ${description}</p>
        <p>Date limite : ${deadline}</p>
        <p>Date du rappel : ${reminder.reminderDate}</p>
      </div>
    </div>
  `;

  // Envoyer l'e-mail HTML
  await this.mailerService.sendMail(user.email, 'Rappel', htmlContent);
}
}









