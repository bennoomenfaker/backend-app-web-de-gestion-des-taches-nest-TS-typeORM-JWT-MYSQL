import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/entities/user.entity'; // Import de l'entité User
import { StatusTask } from '../StatusTask';
import { Collaboration } from 'src/collaboration/entities/collaboration.entity';
import { Reminder } from 'src/reminder/entities/reminder.entity';

@Entity()
export class Task {
    
    @PrimaryGeneratedColumn()
    taskId: number;

    @Column()
    @IsNotEmpty()
    titre: string;

    @Column({ type: 'longtext' })
    @IsNotEmpty()
    description: string;


    @Column({ default: StatusTask.EnAttente })
    status: StatusTask;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreation: Date;

    @Column({ type: 'timestamp' })
    deadline: Date;

    @Column()
    @IsNotEmpty()
    userId: number;

    @Column({ default: true })
    activated: boolean;

    @ManyToOne(() => User, user => user.tasks) // Plusieurs tâches appartiennent à un utilisateur
    @JoinColumn({ name: 'userId' }) // Colonne utilisée pour la jointure
    user: User; // L'utilisateur associé à cette tâche
   
    @OneToMany(() => Reminder, reminder => reminder.task)
    reminders: Reminder[]; // Relation OneToMany avec les rappels

    //@OneToMany(() => Collaboration, collaboration => collaboration.task)
    //collaborations: Collaboration[]; // Relation OneToMany avec les collaborations
}
