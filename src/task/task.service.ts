/**
 findAll(): Récupère toutes les tâches de la base de données.
findOne(taskId: number): Récupère une tâche spécifique à partir de son ID.
create(taskData: TaskDto): Crée une nouvelle tâche dans la base de données.
update(taskId: number, taskData: TaskDto): Met à jour une tâche existante dans la base de données.
remove(taskId: number): Désactive une tâche spécifique en définissant son état activated sur false.
activate(taskId: number): Active une tâche désactivée en définissant son état activated sur true.
findTaskByUserId(userId: number): Récupère toutes les tâches associées à un utilisateur spécifique.
createTaskWithEmail(taskDto: TaskDto, attachmentData: any, attachmentName: any): Crée une nouvelle tâche et envoie un e-mail avec des détails de tâche et une pièce join
 */



import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskDto } from './dto/task.dto';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/auth/config/send-email.service';
import { Collaboration } from 'src/collaboration/entities/collaboration.entity';

@Injectable()
export class TaskService {


  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly sendEmailService: SendEmailService,

    @InjectRepository(Collaboration)
    private readonly collaborationRepository: Repository<Collaboration>,
  ) { }

/*  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }
*/
async findOne(taskId: number): Promise<Task> {
  // Récupérer la tâche avec ses rappels associés
  const task = await this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.reminders', 'reminder')
      .where('task.taskId = :taskId', { taskId })
      .getOne();

  if (!task) {
      throw new NotFoundException(`Task not found with id: ${taskId}`);
  }
    
  return task;
}
  async create(taskData: TaskDto ): Promise<Task> {
    // Vérifie si l'utilisateur associé à la tâche existe
    const user = await this.userRepository.findOneBy({ id: taskData.userId });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${taskData.userId}`);
    }

    // Vérifie si la date limite est postérieure à la date actuelle
    const currentDate = new Date();
    const deadlineDate = new Date(taskData.deadline); // Convertir la chaîne de date en objet Date
    if (deadlineDate.getTime() <= currentDate.getTime()) {
      throw new NotFoundException('Deadline must be in the future');
    }

    // Crée la tâche avec l'utilisateur associé
    const task = this.taskRepository.create({ ...taskData });

    // Envoie de l'e-mail avec les détails de la tâche 
 
      this.sendEmailService.sendTaskCreatedEmail(user.email, task)


    return this.taskRepository.save(task);
  }


  async update(taskId: number, taskData: TaskDto): Promise<Task> {
    const user = await this.userRepository.findOneBy({ id: taskData.userId });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${taskData.userId}`);
    }

    // Vérifie si la date limite est postérieure à la date actuelle
    const currentDate = new Date();
    const deadlineDate = new Date(taskData.deadline); // Convertir la chaîne de date en objet Date
    if (deadlineDate.getTime() <= currentDate.getTime()) {
      throw new NotFoundException('Deadline must be in the future');
    }
    const task = await this.findOne(taskId);
    if (!task) {
      throw new NotFoundException(`User not found with id: ${taskId}`);
    }

    await this.taskRepository.update(taskId, taskData);

    // Envoie de l'e-mail avec les détails mis à jour de la tâche

      this.sendEmailService.sendTaskUpdatedEmail(user.email, taskData)
  
    return this.findOne(taskId);
  }




  async remove(taskId: number): Promise<number> {
    // Récupérer les détails de la tâche avant de la désactiver
    const taskToDeactivate = await this.findOne(taskId);

    // Vérifier si la tâche existe
    if (!taskToDeactivate) {
        throw new NotFoundException(`Task not found with id: ${taskId}`);
    }

    // Désactiver la tâche en définissant activated à false
    taskToDeactivate.activated = false;

    // Enregistrer la tâche mise à jour dans la base de données
    await this.taskRepository.save(taskToDeactivate);

    // Récupérer l'utilisateur associé à la tâche
    const user = await this.userRepository.findOneBy({ id: taskToDeactivate.userId });

    // Envoyer l'e-mail après la désactivation de la tâche
    this.sendEmailService.sendTaskDeletedEmail(user.email, taskToDeactivate);

    return taskId;
}



async activate(taskId: number): Promise<void> {
  // Récupérer les détails de la tâche avant de la désactiver
  const taskToDeactivate = await this.findOne(taskId);

  // Vérifier si la tâche existe
  if (!taskToDeactivate) {
      throw new NotFoundException(`Task not found with id: ${taskId}`);
  }

  // Désactiver la tâche en définissant activated à false
  taskToDeactivate.activated = true;

  // Enregistrer la tâche mise à jour dans la base de données
  await this.taskRepository.save(taskToDeactivate);

  // Récupérer l'utilisateur associé à la tâche
  const user = await this.userRepository.findOneBy({ id: taskToDeactivate.userId });

  // Envoyer l'e-mail après la désactivation de la tâche
  this.sendEmailService.sendActivatedTask(user.email, taskToDeactivate);
}






  /*async createTaskWithAttachment(taskDto: TaskDto, attachmentData: any, attachmentName: any): Promise<Task> {
    // Vérifie si l'utilisateur associé à la tâche existe
    const user = await this.userRepository.findOneBy({ id: taskDto.userId });
    if (!user) {
      throw new NotFoundException(`User not found with id: ${taskDto.userId}`);
    }
  
    // Vérifie si la date limite est postérieure à la date actuelle
    const currentDate = new Date();
    const deadlineDate = new Date(taskDto.deadline); // Convertir la chaîne de date en objet Date
    if (deadlineDate.getTime() <= currentDate.getTime()) {
      throw new NotFoundException('Deadline must be in the future');
    }
  
    // Crée la tâche avec l'utilisateur associé
    const task = this.taskRepository.create(taskDto);
   // console.log(task)
    // Envoie de l'e-mail avec les détails de la tâche
    await this.sendEmailService.sendTaskCreatedEmailWithAttachment(user.email, task, attachmentData, attachmentName);
  
    return this.taskRepository.save(task);
  }
*/

//ici
async getAllTasks(userId: number): Promise<Task[]> {
    // Récupérer toutes les tâches
    const allTasks = await this.taskRepository.createQueryBuilder('task')
    .leftJoinAndSelect('task.reminders', 'reminder')
    .getMany();

    // Récupérer les IDs des tâches collaboratives pour l'utilisateur spécifié
    const collaborationTasks = await this.collaborationRepository
      .createQueryBuilder('collaboration')
      .leftJoinAndSelect('collaboration.task', 'task')
      .where('collaboration.userId = :userId', { userId })
      .getMany();

    // Récupérer les IDs des tâches collaboratives
    const collaborativeTaskIds = collaborationTasks.map(collaboration => collaboration.task.taskId);

    // Filtrer les tâches pour exclure celles sur lesquelles l'utilisateur a collaboré
    const tasks = allTasks.filter(task => !collaborativeTaskIds.includes(task.taskId));
   
    return tasks;
}





async addCollaboratorsToTask(taskId: number, userIds: number[]): Promise<Collaboration> {
  const task = await this.taskRepository.findOneBy({ taskId });
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  let collaboration: Collaboration | undefined;

  for (const userId of userIds) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Vérifiez si l'utilisateur est déjà collaborateur de cette tâche
    const existingCollaboration = await this.collaborationRepository.findOne({
      where: {
        task,
        user
      }
    });

    // Si l'utilisateur n'est pas déjà collaborateur, ajoutez-le
    if (!existingCollaboration) {
      collaboration = new Collaboration();
      collaboration.task = task;
      collaboration.user = user;
      await this.collaborationRepository.save(collaboration); // Enregistrez la nouvelle collaboration
    }
  }

  if (!collaboration) {
    throw new Error('No collaborations added');
  }

  return collaboration;
}


async removeCollaboratorFromTask(taskId: number, userId: number): Promise<User> {
  const task = await this.taskRepository.findOneBy({taskId});
  if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
  }

  const user = await this.userRepository.findOneBy({id : userId});
  if (!user) {
      throw new Error(`User with id ${userId} not found`);
  }

  // Recherchez la collaboration correspondant à la tâche et à l'utilisateur spécifiés
  const collaboration = await this.collaborationRepository.findOne({
      where: {
          task,
          user
      }
  });

  if (!collaboration) {
      throw new Error(`Collaboration between task ${taskId} and user ${userId} not found`);
  }

  // Supprimez la collaboration de la base de données
  await this.collaborationRepository.remove(collaboration);

  return user;
}

async findUserByTaskId(taskId: number): Promise<User> {
  // Recherchez la collaboration associée à la tâche spécifique
  const collaboration = await this.collaborationRepository.findOne({
    where: {
      task: { taskId: taskId },
    },
    relations: ['user'], // Charger l'utilisateur lié à la collaboration
  });

  // Si la collaboration est trouvée, renvoyez l'utilisateur associé
  if (collaboration) {
    return collaboration.user;
  }

  // Si aucune collaboration n'est trouvée, recherchez la tâche directement dans la table des tâches
  const task = await this.taskRepository.findOneBy({taskId});

  if (!task) {
    throw new NotFoundException(`Task not found with id: ${taskId}`);
  }

  // Vérifiez si userId existe dans la tâche
  if (!task.userId) {
    throw new NotFoundException(`User ID not found for task with id: ${taskId}`);
  }

  // Récupérer l'utilisateur associé à la tâche
  const user = await this.userRepository.findOneBy({id:task.userId});

  if (!user) {
    throw new NotFoundException(`User not found for task with id: ${taskId}`);
  }

  return user;
}




  
}