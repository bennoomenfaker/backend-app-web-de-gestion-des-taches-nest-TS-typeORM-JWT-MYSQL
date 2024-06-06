import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './entities/reminder.entity';
import { Task } from 'src/task/entities/task.entity';
import { Collaboration } from 'src/collaboration/entities/collaboration.entity';
import { SendEmailService } from 'src/auth/config/send-email.service'; // Importez SendEmailService
import { MailerService } from 'src/auth/config/config-mail.service'; // Importez MailerService
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { CollaborationService } from 'src/collaboration/collaboration.service';
import { TaskService } from 'src/task/task.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder,Task,Collaboration,User]), // Inclure les entités dans TypeOrmModule
  ],
  controllers: [ReminderController],
  providers: [ReminderService , SendEmailService, MailerService , JwtService,CollaborationService,TaskService],
})
export class ReminderModule {}
