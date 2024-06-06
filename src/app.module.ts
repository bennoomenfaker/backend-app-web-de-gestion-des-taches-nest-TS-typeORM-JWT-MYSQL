import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { config } from './auth/config/constants';
import { TaskModule } from './task/task.module';
import { Task } from './task/entities/task.entity';
import { RepetitiveTaskModule } from './repetitive-task/repetitive-task.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { Collaboration } from './collaboration/entities/collaboration.entity';
import { RepetitiveTask } from './repetitive-task/entities/repetitive-task.entity';
import { ReminderModule } from './reminder/reminder.module';

// Importez le module ScheduleModule depuis @nestjs/schedule
import { ScheduleModule } from '@nestjs/schedule';
import { Reminder } from './reminder/entities/reminder.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
         type:"mysql",
         host:config.host,
         port:config.port,
         username:config.username,
         password:config.password,
         database:config.database,
         entities:[User,Task,Collaboration,RepetitiveTask,Reminder],
         synchronize:true,
    }),
    UserModule,
    AuthModule,
    TaskModule,
    RepetitiveTaskModule,
    CollaborationModule,
    ReminderModule,
    // Ajoutez ScheduleModule.forRoot() à vos imports
    ScheduleModule.forRoot(),
    
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { config } from './auth/config/constants';
import { TaskModule } from './task/task.module';
import { Task } from './task/entities/task.entity';
import { RepetitiveTaskModule } from './repetitive-task/repetitive-task.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { Collaboration } from './collaboration/entities/collaboration.entity';
import { RepetitiveTask } from './repetitive-task/entities/repetitive-task.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
         type:"mysql",
         host:config.host,
         port:config.port,
         username:config.username,
         password:config.password,
         database:config.database,
         entities:[User,Task,Collaboration,RepetitiveTask],
         synchronize:true,
    }),
    UserModule,
    AuthModule,
    TaskModule,
    RepetitiveTaskModule,
    CollaborationModule,
    
    
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
 */