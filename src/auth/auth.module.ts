import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importer TypeOrmModule
import { User } from '../user/entities/user.entity'; // Assurez-vous d'importer l'entité User depuis le bon emplacement
import { config } from 'src/auth/config/constants';
import { MailerService } from 'src/auth/config/config-mail.service';
import { SendEmailService } from './config/send-email.service';


@Module({
  imports: [
    JwtModule.register({
      secret: config.secret, 
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User]), // Ajouter TypeOrmModule.forFeature([User]) pour lier l'entité User
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService , MailerService , SendEmailService],
})
export class AuthModule {}
