import { Injectable, Logger , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepetitiveTask } from './entities/repetitive-task.entity';
import { RepetitiveTaskDto } from './dto/repetitive-task.dto';
import { User } from 'src/user/entities/user.entity';
import { SendEmailService } from 'src/auth/config/send-email.service';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class RepetitiveTaskService {
  constructor(
    @InjectRepository(RepetitiveTask)
    private readonly repetitiveTaskRepository: Repository<RepetitiveTask>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly sendEmailService: SendEmailService, // Injectez le service d'envoi d'e-mails

    //private readonly logger = new Logger(RepetitiveTaskService.name)// Utilisez RepetitiveTaskService.name


  ) {}

  async create(repetitiveTaskDto: RepetitiveTaskDto): Promise<RepetitiveTask> {
    // Vérifier si l'utilisateur avec cet userId existe
    const user = await this.userRepository.findOneBy({id : repetitiveTaskDto.userId});
    if (!user) {
      throw new NotFoundException(`User with ID ${repetitiveTaskDto.userId} not found`);
    }
    const repetitiveTask = this.repetitiveTaskRepository.create(repetitiveTaskDto);
    return await this.repetitiveTaskRepository.save(repetitiveTask);
  }

  async findAll(): Promise<RepetitiveTask[]> {
    
    return await this.repetitiveTaskRepository.find();
  }

  async findOne(taskId: number): Promise<RepetitiveTask> {
    const repetitiveTask = await this.repetitiveTaskRepository.findOneBy({taskId});
    if (!repetitiveTask) {
      throw new NotFoundException(`Repetitive task with ID ${taskId} not found`);
    }

    
    return repetitiveTask;
  }

  async update(taskId: number, repetitiveTaskDto: RepetitiveTaskDto): Promise<RepetitiveTask> {
     // Vérifier si l'utilisateur avec cet userId existe
     const user = await this.userRepository.findOneBy({id : repetitiveTaskDto.userId});
     if (!user) {
       throw new NotFoundException(`User with ID ${repetitiveTaskDto.userId} not found`);
     }
    const repetitiveTask = await this.repetitiveTaskRepository.findOneBy({taskId});
    if (!repetitiveTask) {
      throw new NotFoundException(`Repetitive task with ID ${taskId} not found`);
    }
    this.repetitiveTaskRepository.merge(repetitiveTask, repetitiveTaskDto);
    return await this.repetitiveTaskRepository.save(repetitiveTask);
  }

  async remove(taskId: number): Promise<number> {
    const repetitiveTask = await this.repetitiveTaskRepository.findOneBy({taskId});
    if (!repetitiveTask) {
      throw new NotFoundException(`Repetitive task with ID ${taskId} not found`);
    }
    repetitiveTask.activated = false;
    await this.repetitiveTaskRepository.save(repetitiveTask);
    return taskId;
  }


  async activate(taskId: number): Promise<void> {
    const repetitiveTask = await this.repetitiveTaskRepository.findOneBy({taskId});
    if (!repetitiveTask) {
      throw new NotFoundException(`Repetitive task with ID ${taskId} not found`);
    }
    repetitiveTask.activated = true;
    await this.repetitiveTaskRepository.save(repetitiveTask);
  }
 
 
  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndSendEmails() {
    try {
      const repetitiveTasks = await this.repetitiveTaskRepository.find({ where: { activated: true } });

      for (const task of repetitiveTasks) {
        if (task.datePublication <= new Date()) {
          // Récupérez tous les utilisateurs activés
          const users = await this.userRepository.find({ where: { activated: true } });
          
          // Envoyez un e-mail à chaque utilisateur pour la tâche répétitive
          for (const user of users) {
            await this.sendEmailService.sendPublicationEmail(user.email, task);
          }

          // Mettez à jour la date de publication pour la prochaine année
          task.datePublication.setFullYear(task.datePublication.getFullYear() + 1);
          await this.repetitiveTaskRepository.save(task);
        }
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'envoi des e-mails:', error);
    }
  }
  }

