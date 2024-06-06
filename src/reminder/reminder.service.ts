import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SendEmailService } from 'src/auth/config/send-email.service';
import { User } from 'src/user/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';
import { TaskService } from 'src/task/task.service';
import { Collaboration } from 'src/collaboration/entities/collaboration.entity';
import { CollaborationService } from 'src/collaboration/collaboration.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,

    private readonly sendEmailService: SendEmailService, // Injectez le service d'envoi d'e-mails
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
   
    private readonly collaborationService:CollaborationService,
    private readonly taskService:TaskService,

     
  ) {}

  /*async createReminder(reminderData: Partial<Reminder>): Promise<Reminder> {
    const reminder = this.reminderRepository.create(reminderData);
    return await this.reminderRepository.save(reminder);
  }*/
  async createReminders(reminderDataArray: Partial<Reminder>[]): Promise<Reminder[]> {
    const reminders: Reminder[] = [];
    
    for (const reminderData of reminderDataArray) {
        const reminder = this.reminderRepository.create(reminderData);
        reminders.push(await this.reminderRepository.save(reminder));
    }

    return reminders;
}



// Méthode pour vérifier périodiquement les rappels et envoyer des e-mails pour les rappels dont la date est atteinte
@Cron(CronExpression.EVERY_MINUTE)
  async checkAndSendReminders() {
    try {
      // Récupérez tous les rappels 
      const reminders = await this.reminderRepository.find();

      // Itérer sur chaque rappel
    // Itérer sur chaque rappel
for (const reminder of reminders) {

  const reminderDateAdjusted = new Date(reminder.reminderDate); // Créez une nouvelle instance de Date à partir de la date du rappel
  const dateNow = new Date(); // Obtenez l'heure actuelle
  dateNow.setHours(dateNow.getHours() + 1); // Ajoutez une heure



  reminderDateAdjusted.setHours(reminderDateAdjusted.getHours() + 1); // Incrémentez l'heure de 1 heure
  //console.log(reminderDateAdjusted<dateNow)

  

 // console.log(reminderDateAdjusted); // Affiche la date du rappel avec l'heure incrémentée d'une heure
//console.log(dateNow<=reminderDateAdjusted)

        if (reminderDateAdjusted <= dateNow) {
         
          // Récupérez tous les utilisateurs collaborateurs pour la tâche spécifiée
          const collaborativeUsers = await this.collaborationService.findCollaborativeUsersForTask(reminder.taskId);
         // console.log(collaborativeUsers)
          /*if(!collaborativeUsers){  
           
            // Récupérez les détails de la tâche
            const task = await this.taskRepository.findOneBy({taskId : reminder.taskId});
            const user = await this.taskService.findUserByTaskId(task.taskId)
            // Utilisez le service d'envoi d'e-mails pour envoyer un e-mail de rappel à l'utilisateur
            await this.sendEmailService.sendReminderEmail(user, reminder, task);
          }*/
          // Itérez sur chaque utilisateur collaborateur
          for (const user of collaborativeUsers) {
            // Récupérez les détails de la tâche
            const task = await this.taskRepository.findOneBy({taskId : reminder.taskId});

            // Utilisez le service d'envoi d'e-mails pour envoyer un e-mail de rappel à l'utilisateur
            await this.sendEmailService.sendReminderEmail(user, reminder, task);
          }


          // Récupérez les détails de la tâche
         // const task = await this.taskRepository.findOneBy({taskId : reminder.taskId});
          //const user = await this.taskService.findUserByTaskId(task.taskId)
          // Utilisez le service d'envoi d'e-mails pour envoyer un e-mail de rappel à l'utilisateur
          //await this.sendEmailService.sendReminderEmail(user, reminder, task);
          // Supprimez le rappel une fois qu'il est envoyé à tous les utilisateurs collaborateurs
          await this.reminderRepository.remove(reminder);
        }
      }
    } catch (error) {
      //console.error('Une erreur s\'est produite lors de la vérification et de l\'envoi des rappels:', error);
    }
  }


async updateReminders(taskId: number, remindersData: Reminder[]): Promise<void> {
  // Récupérer les rappels associés à la tâche
  const reminders = await this.reminderRepository.find({ where: { taskId } });

  // Mettre à jour les rappels avec les nouvelles données
  for (const reminder of reminders) {
    const newReminderData = remindersData.find(r => r.reminderId === reminder.reminderId);
    if (newReminderData) {
      // Mettre à jour les propriétés du rappel
      reminder.reminderDate = newReminderData.reminderDate;

      // Enregistrer les modifications dans la base de données
      await this.reminderRepository.save(reminder);
    }
  }
}


async deleteReminderById(reminderId: number): Promise<void> {
  try {
    await this.reminderRepository.delete({reminderId});
  } catch (error) {
    console.error(`Une erreur s'est produite lors de la suppression du rappel avec l'ID ${reminderId}:`, error);
    throw error;
  }
}

/*
// Méthode pour vérifier périodiquement les rappels et envoyer des e-mails pour les rappels dont la date est atteinte
@Cron(CronExpression.EVERY_MINUTE) // Exécutez cette méthode toutes les minutes
async checkAndSendReminders() {
  try {
    // Récupérez tous les rappels 
    const reminders = await this.reminderRepository.find();
    // Créez un tableau pour stocker les rappels 
    const remindersToDelete = [];
    // Pour chaque rappel trouvé, envoyez un e-mail si la date est atteinte et si le rappel n'a pas déjà été envoyé
    for (const reminder of reminders) {
      if (reminder.reminderDate <= new Date() ) {

        // Récupérez l'utilisateur associé à la tâche du rappel
        const user = await this.userRepository.findOne({ relations: ['tasks'], where: { tasks: { taskId: reminder.taskId } } });

        if (!user) {
          console.error('Utilisateur non trouvé pour la tâche', reminder.taskId);
          continue; // Passez à l'itération suivante si l'utilisateur n'est pas trouvé
        }
         const task = await this.taskRepository.findOneBy({taskId : reminder.taskId});

        // Utilisez le service d'envoi d'e-mails pour envoyer un e-mail
        await this.sendEmailService.sendReminderEmail(user, reminder, task);

        // Ajoutez le rappel à la liste des rappels à supprimer
        remindersToDelete.push(reminder);
      }
    }
    
    // Supprimez tous les rappels marqués pour suppression
    await this.reminderRepository.remove(remindersToDelete);
    
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la vérification et de l\'envoi des rappels:', error);
  }
}
 */




@Cron(CronExpression.EVERY_10_SECONDS)
  async checkAndSendReminders1() {
    try {
      // Récupérez tous les rappels 
      const reminders = await this.reminderRepository.find();

      // Itérer sur chaque rappel
    // Itérer sur chaque rappel
for (const reminder of reminders) {

  const reminderDateAdjusted = new Date(reminder.reminderDate); // Créez une nouvelle instance de Date à partir de la date du rappel
  const dateNow = new Date(); // Obtenez l'heure actuelle
  dateNow.setHours(dateNow.getHours() + 1); // Ajoutez une heure



  reminderDateAdjusted.setHours(reminderDateAdjusted.getHours() + 1); // Incrémentez l'heure de 1 heure
  //console.log(reminderDateAdjusted<dateNow)

  

 // console.log(reminderDateAdjusted); // Affiche la date du rappel avec l'heure incrémentée d'une heure
//console.log(dateNow<=reminderDateAdjusted)

        if (reminderDateAdjusted <= dateNow) {
         
        
        

          // Récupérez les détails de la tâche
         const task = await this.taskRepository.findOneBy({taskId : reminder.taskId});
         const user = await this.taskService.findUserByTaskId(task.taskId)
          // Utilisez le service d'envoi d'e-mails pour envoyer un e-mail de rappel à l'utilisateur
          await this.sendEmailService.sendReminderEmail(user, reminder, task);
          // Supprimez le rappel une fois qu'il est envoyé à tous les utilisateurs collaborateurs
          await this.reminderRepository.remove(reminder);
        }
      }
    } catch (error) {
      //console.error('Une erreur s\'est produite lors de la vérification et de l\'envoi des rappels:', error);
    }
  }

}
