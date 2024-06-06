import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class Collaboration {
    @PrimaryGeneratedColumn()
    collaborationId: number;

    
    @ManyToOne(() => Task)
    @JoinColumn({ name: 'taskId' })
    task: Task;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

}
