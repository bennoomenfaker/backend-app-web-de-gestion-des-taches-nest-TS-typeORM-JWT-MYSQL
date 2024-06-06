import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Frequency } from '../frequency-enum';

@Entity()
export class RepetitiveTask {
    @PrimaryGeneratedColumn()
    taskId: number;

    @Column()
    @IsNotEmpty()
    titre: string;

    @Column({ type: 'longtext' })
    @IsNotEmpty()
    description: string;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateCreation: Date;

    @Column({ type: 'timestamp' })
    datePublication: Date; // Date de publication de la tâche

    @Column()
    @IsNotEmpty()
    userId: number;

    @Column()
    frequency: Frequency;
    
    @Column({ default: true })
    activated: boolean;
    


    @ManyToOne(() => User, user => user.repetitiveTasks)
    @JoinColumn({ name: 'userId' })
    user: User;
}
