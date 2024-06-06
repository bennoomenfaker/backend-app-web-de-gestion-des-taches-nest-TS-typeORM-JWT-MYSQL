import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { UserRole } from '../UserRole';

export class UserDto {

   
    id?:number;

    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    prenom: string;

   

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsString()
    @IsNotEmpty()
    role: UserRole;



    @IsBoolean()
    activated: boolean;

    tel?: string;
    resetPasswordToken?: string; // Token de réinitialisation de mot de passe
    resetPasswordExpires?: Date; // Date d'expiration du token de réinitialisation de mot de passe
}
