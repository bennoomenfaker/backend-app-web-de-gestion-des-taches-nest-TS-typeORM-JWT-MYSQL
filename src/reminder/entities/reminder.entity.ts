import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { Collaboration } from '../../collaboration/entities/collaboration.entity';

@Entity()
export class Reminder {
    @PrimaryGeneratedColumn()
    reminderId: number;

    @Column({ type: 'timestamp' })
    reminderDate: Date; // Date et heure du rappel

    @Column()
    reminderType: 'task' | 'collaboration'; // Type de rappel (tâche ou collaboration)

    @Column({ nullable: false })
    taskId: number; // ID de la tâche associée

  
    @ManyToOne(() => Task, { nullable: true })
    @JoinColumn({ name: 'taskId' })
    task: Task; // La tâche associée au rappel (nullable)

    @Column({ nullable: true })
    collaborationId: number; // ID de la collaboration associée

    @ManyToOne(() => Collaboration, { nullable: true })
    @JoinColumn({ name: 'collaborationId' })
    collaboration: Collaboration; // La collaboration associée au rappel (nullable)
}
