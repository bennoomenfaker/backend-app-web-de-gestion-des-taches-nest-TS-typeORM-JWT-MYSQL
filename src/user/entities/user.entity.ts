import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from '../UserRole';
import { Task } from 'src/task/entities/task.entity';
import { RepetitiveTask } from 'src/repetitive-task/entities/repetitive-task.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    nom: string;

    @Column()
    @IsNotEmpty()
    prenom: string;

    @Column()
    tel: string;


    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @Column({ default: UserRole.USER }) // par défaut, le rôle est user
    role: UserRole;

    @Column({ default: true })
    activated: boolean;

    @Column({ nullable: true }) // Le token peut être nullable s'il n'est pas encore défini
    resetPasswordToken: string;
  
    @Column({ type: 'timestamp', nullable: true }) // La date d'expiration peut être nullable s'il n'est pas encore défini
    resetPasswordExpires: Date;
   
    @OneToMany(() => Task, task => task.user) // Un utilisateur peut avoir plusieurs tâches
    tasks: Task[]; // Les tâches associées à cet utilisateur

    @OneToMany(() => RepetitiveTask, repetitiveTask => repetitiveTask.user)
    repetitiveTasks: RepetitiveTask[];

    
}

