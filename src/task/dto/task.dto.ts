import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StatusTask } from '../StatusTask';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  readonly titre: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  readonly userId: number;

  @IsString()
  @IsNotEmpty()
  readonly status: StatusTask;

  @IsNotEmpty()
  readonly deadline: Date;
}
