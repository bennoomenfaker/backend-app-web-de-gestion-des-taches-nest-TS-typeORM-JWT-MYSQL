

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { User } from '../user/entities/user.entity';
import { Collaboration } from './entities/collaboration.entity';
import { SendEmailService } from 'src/auth/config/send-email.service';

@Injectable()
export class CollaborationService {
    
    
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Collaboration)
        private collaborationRepository : Repository<Collaboration>,

        private readonly sendEmailService: SendEmailService



    ) {}

    async assignTask(taskId: number, userIds: number[]): Promise<Task> {
        const task = await this.taskRepository.findOneBy({taskId});
        if (!task) {
            throw new Error('Task not found');
        }
        

    
        const collaborations: Collaboration[] = [];
        for (const userId of userIds) {
            const user = await this.userRepository.findOneBy({id : userId});
            if (!user) {
                throw new Error(`User with id ${userId} not found`);
            }
            const collaboration = new Collaboration();
            collaboration.task = task;
            collaboration.user = user;
            collaborations.push(collaboration);
    
            // Envoyer un e-mail de collaboration à l'utilisateur
            this.sendEmailService.sendCollaborationEmail(user.email, task);
        }
    
        await this.collaborationRepository.save(collaborations);
    
        return task;
    }
    async assignTaskWithAttachmen(taskId: number, userIds: number[], attachmentData: any, attachmentName: any): Promise<Task> {
        const task = await this.taskRepository.findOneBy({taskId});
        if (!task) {
            throw new Error('Task not found');
        }
        // Vérifiez d'abord que userIds est bien un tableau avant d'utiliser includes
       /* if (!Array.isArray(userIds)) {
            throw new Error('userIds is not an array');
        }*/
    
        // Ajoutez task.userId à userIds s'il n'est pas déjà inclus
       /* if (!userIds.includes(task.userId)) {
            userIds.push(task.userId);
        }*/
    
        const collaborations: Collaboration[] = [];
        for (const userId of userIds) {
            const user = await this.userRepository.findOneBy({id : userId});
            if (!user) {
                throw new Error(`User with id ${userId} not found`);
            }
            const collaboration = new Collaboration();
            collaboration.task = task;
            collaboration.user = user;
            collaborations.push(collaboration);
            // Envoyer un e-mail de collaboration à l'utilisateur
            this.sendEmailService.sendCollaborationEmailWithAttachment(user.email, task , attachmentData,attachmentName);
        }
    
        await this.collaborationRepository.save(collaborations);
    
        return task;
    }
    

    // récupérer la liste des tâches collaboratives associées à un utilisateu
    async findCollaborativeTasksByUserId(userId: number): Promise<Task[]> {
        const collaborations = await this.collaborationRepository.find({
            where: {
                user: { id: userId }, // Rechercher les collaborations de l'utilisateur spécifié
            },
            relations: ['task'], // Inclure la relation avec la tâche
        });

        // Extraire les tâches des collaborations
        const collaborativeTasks = collaborations.map(collaboration => collaboration.task);

        return collaborativeTasks;
    }
  

        // Méthode pour récupérer les utilisateurs avec lesquels vous avez collaboré sur une tâche spécifique
    async findCollaborativeUsersForTask(taskId: number): Promise<User[]> {
        // Recherche des collaborations pour la tâche spécifiée
        const collaborations = await this.collaborationRepository.find({
            where: {
                task: { taskId }
            },
            relations: ['user'] // Charger les détails de l'utilisateur associé à la collaboration
        });

        if (!collaborations || collaborations.length === 0) {
            throw new NotFoundException(`No collaborations found for task with ID ${taskId}`);
        }

        // Extraire les utilisateurs des collaborations
        const collaborativeUsers: User[] = collaborations.map(collaboration => collaboration.user);

        return collaborativeUsers;
    }



    
}
