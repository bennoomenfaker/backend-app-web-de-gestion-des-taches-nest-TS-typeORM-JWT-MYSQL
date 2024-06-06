import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from 'src/auth/config/send-email.service';
import { MailerService } from 'src/auth/config/config-mail.service';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports :[TypeOrmModule.forFeature([User,Task])],
  controllers: [UserController],
  providers: [UserService , JwtService ,SendEmailService ,MailerService],
})
export class UserModule {}

/**L'erreur que vous rencontrez indique que le service JwtService n'est pas disponible 
 * dans le contexte du module UserModule lorsqu'il est utilisé avec AuthGuard */
