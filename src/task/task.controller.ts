import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors, NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { AuthGuard } from 'src/auth/autorisation/auth.guard';
import { HasAdminOrUserGuard } from 'src/auth/autorisation/has-admin-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Collaboration } from 'src/collaboration/entities/collaboration.entity';
import { User } from 'src/user/entities/user.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
   /*@UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Get()
 async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }*/
  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return this.taskService.findOne(id);
  }
  @Get(':taskId/user')
  async findUserByTaskId(@Param('taskId') taskId: number): Promise<User> {
    try {
      return await this.taskService.findUserByTaskId(taskId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AuthGuard, HasAdminOrUserGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTask(
    @Body() taskDto: TaskDto,
    @UploadedFile() file?: Express.Multer.File // Déclarer le fichier comme optionnel
  ): Promise<Task> {
    let attachmentData;
    let attachmentName;
  
    if (file) {
      attachmentData = file.buffer; // Récupérer le contenu du fichier
      attachmentName = file.originalname; // Récupérer le nom du fichier
    }
  
    // Appeler la méthode de création de tâche avec ou sans pièce jointe en fonction de la présence du fichier
    //if (!file) {
      return this.taskService.create(taskDto);
    //} else {
      //return this.taskService.createTaskWithAttachment(taskDto, attachmentData , attachmentName);
   // }
  }
  

  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() taskDto: TaskDto): Promise<Task> {
    return this.taskService.update(id, taskDto);
  }

  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<number> {
    return this.taskService.remove(id);
  }

  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Delete('activate/:id')
  async activate(@Param('id') id: number): Promise<void> {
    return this.taskService.activate(id);
  }
  
  
  /*@UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Get('user/:userId')
  async findTasksByUserId(@Param('userId') userId: number): Promise<Task[]> {
    return this.taskService.getAllTasks(userId);
  }*/


  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Get('user/:userId/users')
  async findTasksByUserId1(@Param('userId') userId: number): Promise<Task[]> {
    return this.taskService.getAllTasks(userId);
  }

//ajouter un collaborateur
@UseGuards(AuthGuard, HasAdminOrUserGuard)
@Post(':taskId/addCollaborators')
async addCollaboratorsToTask(
  @Param('taskId') taskId: number,
  @Body() userIds: number[]
): Promise<Collaboration> {
  const collaboration = await this.taskService.addCollaboratorsToTask(taskId, userIds);
  return collaboration;
}

  //supprimer un collabprateutr

  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Delete(':taskId/removeCollaborator/:userId')
  async removeCollaboratorFromTask(
    @Param('taskId') taskId: number,
    @Param('userId') userId: number
  ): Promise<User> {
     const user =await this.taskService.removeCollaboratorFromTask(taskId, userId);
     return user;
  }
}

