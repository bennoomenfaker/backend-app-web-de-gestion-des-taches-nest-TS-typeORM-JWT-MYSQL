import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepetitiveTaskService } from './repetitive-task.service';
import { RepetitiveTaskController } from './repetitive-task.controller';
import { User } from 'src/user/entities/user.entity';
import { RepetitiveTask } from './entities/repetitive-task.entity';
import { SendEmailService } from 'src/auth/config/send-email.service'; // Importez SendEmailService
import { MailerService } from 'src/auth/config/config-mail.service'; // Importez MailerService
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([RepetitiveTask, User]), // Inclure les entités dans TypeOrmModule
  ],
  controllers: [RepetitiveTaskController],
  providers: [RepetitiveTaskService, SendEmailService, MailerService , JwtService], // Inclure SendEmailService et MailerService ici
})
export class RepetitiveTaskModule {}

