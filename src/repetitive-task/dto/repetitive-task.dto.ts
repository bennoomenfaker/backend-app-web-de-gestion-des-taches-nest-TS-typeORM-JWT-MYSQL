import { IsNotEmpty } from 'class-validator';
import { Frequency } from '../frequency-enum';

export class RepetitiveTaskDto {
   
    @IsNotEmpty()
    readonly titre: string;

    @IsNotEmpty()
    readonly description: string;
    
    dateCreation: Date;

    @IsNotEmpty()
    readonly datePublication: Date;

  

    @IsNotEmpty()
    readonly userId: number;

    @IsNotEmpty()
    readonly frequency: Frequency;
}
