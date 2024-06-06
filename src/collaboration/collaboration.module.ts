import { Module } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { CollaborationController } from './collaboration.controller';
import { Collaboration } from './entities/collaboration.entity';
import { User } from 'src/user/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendEmailService } from 'src/auth/config/send-email.service';
import { MailerService } from 'src/auth/config/config-mail.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports :[TypeOrmModule.forFeature([Task,User,Collaboration])],

  controllers: [CollaborationController],
  providers: [CollaborationService , JwtService,SendEmailService , MailerService],
})
export class CollaborationModule {}
