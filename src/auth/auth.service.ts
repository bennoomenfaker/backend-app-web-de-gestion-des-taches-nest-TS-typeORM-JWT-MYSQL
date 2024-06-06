import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/auth.dto'; // Assurez-vous d'importer les DTO appropriés
import { UserService } from '../user/user.service'; // Assurez-vous d'importer UserService
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from 'src/user/dto/user.dto';
import * as crypto from 'crypto';
import { SendEmailService } from './config/send-email.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    //contient les methodes d'envoi email
    private readonly sendEmailService:SendEmailService
  ) {}

  async signin(signinDto: SigninDto): Promise<string> {
    const { email, password } = signinDto;

    const missingFields = [];
    if (!signinDto.email) missingFields.push('email');
    if (!signinDto.password) missingFields.push('password');
    
    if (missingFields.length > 0) {
      throw new ConflictException(`Les champs suivants sont obligatoires : ${missingFields.join(', ')}`);
    }
  

    // Vérifier si l'utilisateur existe
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email invalide.');
    }

    // Vérifier si l'utilisateur est activé
    if (!user.activated) {
      throw new UnauthorizedException('Ce compte utilisateur est désactivé.');
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou mot de passe invalide.');
    }

    // Générer et retourner le jeton JWT
    const payload = { email: user.email, sub: user.id  , role : user.role};
    return this.jwtService.sign(payload);
  }
  


  async signup(userDto: UserDto): Promise<User> {
    // Vérifier si tous les champs obligatoires sont renseignés
    const missingFields = ['email', 'nom', 'prenom'].filter(field => !userDto[field]);
    if (missingFields.length > 0) {
      throw new ConflictException(`Les champs suivants sont obligatoires : ${missingFields.join(', ')}`);
    }
  
    // Vérifier si l'email est déjà utilisé
  const existingUser = await this.userRepository.findOneBy({ email: userDto.email });
  if (existingUser) {
    throw new ConflictException('Cet email est déjà associé à un utilisateur.');
  }
  
    // Générer le mot de passe
    const password = this.generatePassword();
  
    // Générer le token de réinitialisation de mot de passe
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Créer un nouvel utilisateur avec le token et sa date d'expiration
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 heure
    });
  
    // Enregistrer le nouvel utilisateur dans la base de données
    await this.userRepository.save(newUser);
  
    // Envoyer l'e-mail de bienvenue avec le lien de réinitialisation de mot de passe
      this.sendEmailService.sendWelcomeEmail(newUser, resetToken);
     return newUser;
  }
generatePassword(): string {
  // Logique pour générer un mot de passe aléatoire, par exemple :
  return Math.random().toString(36).slice(-8);
}


async resetPassword(token: string, newPassword: string): Promise<{ success: boolean, message?: string }> {
  try {
    // Rechercher l'utilisateur avec le token de réinitialisation de mot de passe
    const user = await this.userRepository.findOneBy({ resetPasswordToken: token });
    // Vérifier si aucun utilisateur n'est trouvé avec ce token
    if (!user) {
        throw new NotFoundException('Token de réinitialisation de mot de passe invalide.');
    }

    // Vérifier si le token de réinitialisation a expiré
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
        throw new ConflictException('Le token de réinitialisation de mot de passe a expiré.');
    }

    // Réinitialiser le mot de passe de l'utilisateur avec le nouveau mot de passe
    user.password = await bcrypt.hash(newPassword, 10);

    // Réinitialiser le token et sa date d'expiration
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Enregistrer les modifications dans la base de données
    await this.userRepository.save(user);

    // Envoyer un e-mail pour informer l'utilisateur que son mot de passe a été réinitialisé
    this.sendEmailService.sendPasswordChangedEmail(user.email);

    // Retourner une réponse de succès
    return { success: true, message: 'Mot de passe réinitialisé avec succès.' };
  } catch (error) {
    // Retourner une réponse d'échec avec un message d'erreur approprié
    return { success: false, message: error.message };
  }
}


async forgotPassword(email: string): Promise<void> {
  // Vérifier si l'email est fourni
  if (!email) {
      throw new ConflictException('L\'adresse e-mail est obligatoire pour réinitialiser le mot de passe.');
  }
  // Vérifier si l'e-mail correspond à un utilisateur existant
  const user = await this.userRepository.findOneBy( {email} );

  // Si aucun utilisateur n'est trouvé avec cet email, lancer une exception
  if (!user) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'email : ${email}`);
  }

  // Générer un jeton de réinitialisation de mot de passe
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Définir le jeton de réinitialisation de mot de passe et sa date d'expiration
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  // Enregistrer les modifications dans la base de données
  await this.userRepository.save(user);

  // Envoyer l'e-mail de réinitialisation de mot de passe
  await this.sendEmailService.sendPasswordResetEmail(user, resetToken);
}


async forgotPasswordMobile(email: string): Promise<string> {
  // Check if email is provided
  if (!email) {
    throw new ConflictException('L\'adresse e-mail est obligatoire pour réinitialiser le mot de passe.');
  }
  
  // Check if the email corresponds to an existing user
  const user = await this.userRepository.findOneBy({ email });

  // If no user is found with this email, throw an exception
  if (!user) {
    throw new NotFoundException(`Aucun utilisateur trouvé avec l'email : ${email}`);
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Set the reset password token and its expiration date
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Save the changes to the database
  await this.userRepository.save(user);
  return resetToken;  
}







 /* async signup(userDto: UserDto): Promise<void> {

      // Vérifier si tous les champs obligatoires sont renseignés
      const missingFields = [];
      if (!userDto.email) missingFields.push('email');
      if (!userDto.password) missingFields.push('password');
      if (!userDto.nom) missingFields.push('nom');
      if (!userDto.prenom) missingFields.push('prenom');
      if (!userDto.role) missingFields.push('role');
      if (missingFields.length > 0) {
        throw new ConflictException(`Les champs suivants sont obligatoires : ${missingFields.join(', ')}`);
      }
    
    // Vérifier si l'email est déjà utilisé
    const existingUser = await this.userService.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà associé à un utilisateur.');
    }
      // Vérifier si le rôle spécifié existe dans l'énumération UserRole
  if (!Object.values(UserRole).includes(userDto.role)) {
    throw new ConflictException('Le rôle spécifié n\'existe pas.');
  }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Créer un nouvel utilisateur
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
  }*/
 

}
