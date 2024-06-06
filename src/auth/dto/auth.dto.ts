// auth.dto.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
