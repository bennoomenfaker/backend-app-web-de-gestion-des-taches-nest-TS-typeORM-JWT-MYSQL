import { IsNotEmpty, IsIn } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  reminderDate: Date;

  @IsNotEmpty()
  @IsIn(['task', 'collaboration'])
  reminderType: 'task' | 'collaboration';
  @IsNotEmpty()
  taskId: number;

}
