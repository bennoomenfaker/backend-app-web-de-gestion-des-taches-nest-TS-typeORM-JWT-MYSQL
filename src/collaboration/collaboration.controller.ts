import { Controller, Post, Body, Param, UseGuards, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { Task } from 'src/task/entities/task.entity';
import { AuthGuard } from 'src/auth/autorisation/auth.guard';
import { HasAdminOrUserGuard } from 'src/auth/autorisation/has-admin-user.guard';
import { User } from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Collaboration } from './entities/collaboration.entity';

@Controller('collaboration')
export class CollaborationController {
    constructor(private readonly collaborationService: CollaborationService) {}
    

    @UseGuards(AuthGuard, HasAdminOrUserGuard)
    @Post(':taskId/assign')
    @UseInterceptors(FileInterceptor('file'))
    async assignTask(
        @Param('taskId') taskId: number,
        @Body('userIds') userIds: [], // Définissez le type de userIds comme une chaîne de caractères
        @UploadedFile() file?: Express.Multer.File // Déclarez le fichier comme optionnel
    ): Promise<Task> {
      let attachmentData;
      let attachmentName;
     // console.log(userIds)
        
      if (file) {
        attachmentData = file.buffer; // Récupérez le contenu du fichier
        attachmentName = file.originalname; // Récupérez le nom du fichier
      }
    
      // Convertissez la chaîne de caractères en tableau JSON
      //const parsedUserIds = JSON.parse(userIds);
    
      // Appelez la méthode de création de tâche avec ou sans pièce jointe en fonction de la présence du fichier
      if (!file) {
        return this.collaborationService.assignTask(taskId, userIds);
      } else {
        return this.collaborationService.assignTaskWithAttachmen(taskId, userIds, attachmentData, attachmentName);
      }
    }
    
    
    
    /*
       @UseGuards(AuthGuard,HasAdminOrUserGuard)
    @Post(':taskId/assign')
    async assignTask(@Param('taskId') taskId: number, @Body() userIds: number[]): Promise<Task> {
        return this.collaborationService.assignTask(taskId, userIds);
    }
 */


    // Méthode pour récupérer les tâches collaboratives d'un utilisateur
    @Get('user/:userId/tasks')
    async getCollaborativeTasksForUser(@Param('userId') userId: number): Promise<Task[]> {
        return this.collaborationService.findCollaborativeTasksByUserId(userId);
    }


     
    // Méthode pour récupérer les utilisateurs avec lesquels vous avez collaboré sur une tâche spécifique
    @Get('task/:taskId/users')
    async getCollaborativeUsersForTask(@Param('taskId') taskId: number): Promise<User[]> {
        return this.collaborationService.findCollaborativeUsersForTask(taskId);
    }
}
