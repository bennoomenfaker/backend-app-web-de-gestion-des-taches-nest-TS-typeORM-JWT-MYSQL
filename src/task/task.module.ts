import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from 'src/auth/config/send-email.service';
import { MailerService } from 'src/auth/config/config-mail.service';
import { Collaboration } from 'src/collaboration/entities/collaboration.entity';
import { Reminder } from 'src/reminder/entities/reminder.entity';

@Module({
  imports :[TypeOrmModule.forFeature([Task,User,Collaboration, Reminder])],

  controllers: [TaskController],
  providers: [TaskService ,JwtService ,SendEmailService,MailerService],
  //kwt srevice ici pour les autorisation
})
export class TaskModule {}
