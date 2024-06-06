import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SendEmailService } from 'src/auth/config/send-email.service';
@Injectable()
export class UserService {
  

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly sendEmailService: SendEmailService
  ){}


  findAll() {
    return this.userRepository.find();
    
  }

  async findOne(id: number) {
    
    const user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return user;
  }

  /*async update(id: number, nom: string, prenom: string, email: string) {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
        throw new NotFoundException(`Utilisateur introuvable avec l'ID : ${id}`);
    }

    // Vérifier si un autre utilisateur avec le même email existe déjà
    const existingEmailUser = await this.userRepository.findOneBy({ email });
    if (existingEmailUser && existingEmailUser.id !== +id) {
        throw new ConflictException('Cet email est déjà associé à un autre utilisateur.');
    }

    // Mettre à jour les données de l'utilisateur
    existingUser.nom = nom;
    existingUser.prenom = prenom;
    existingUser.email = email;

    // Mettre à jour l'utilisateur
    await this.userRepository.save(existingUser);
    return { message: 'User updated successfully' };
}
*/

async update(id: number, nom: string, prenom: string, email: string, tel: string, newPassword?: string) {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
        throw new NotFoundException(`Utilisateur introuvable avec l'ID : ${id}`);
    }

    // Vérifier si un autre utilisateur avec le même email existe déjà
    const existingEmailUser = await this.userRepository.findOneBy({ email });
    if (existingEmailUser && existingEmailUser.id !== +id) {
        throw new ConflictException('Cet email est déjà associé à un autre utilisateur.');
    }
   
    // Mettre à jour les données de l'utilisateur
    existingUser.nom = nom;
    existingUser.prenom = prenom;
    existingUser.email = email;
    existingUser.tel = tel;
   
  
    // Mettre à jour le mot de passe s'il est fourni
    if (newPassword) {
      // Hasher le mot de passe
   const hashedPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedPassword;
    }

    // Mettre à jour l'utilisateur
    await this.userRepository.save(existingUser);
    return { message: 'User updated successfully' };
}



async remove(id: number): Promise<void> {
  const user = await this.findOne(id);
  if (!user) {
    throw new NotFoundException(`User not found with id: ${id}`);
  }
  user.activated = false; // Mettre à jour activated à false
  await this.userRepository.save(user);
  //Envoyer un e-mail de compte désactivé
   this.sendEmailService.sendAccountDeactivatedEmail(user);
}

async activate(id: number): Promise<void> {
  const user = await this.findOne(id);
  if (!user) {
    throw new NotFoundException(`User not found with id: ${id}`);
  }
  user.activated = true; // Mettre à jour activated à false
  await this.userRepository.save(user);
  //Envoyer un e-mail de compte désactivé
   this.sendEmailService.sendAccountDeactivatedEmail(user);
}


  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({email});
    if (!user) {
      throw new NotFoundException(`User not found with email: ${email}`);
    }

     // Vérifier si l'utilisateur est désactivé
  if (!user.activated) {
    
    throw new NotFoundException(`User with email ${email} is deactivated.`);
  }

    return user;
  }


  async sendEmailWithAttachment(userId: string, titre: string, description: string, attachmentData: Buffer, attachmentName: string) {
    const user = await this.findOne(+userId); // Récupérer l'utilisateur par son ID
  
    // Envoyer l'e-mail avec la pièce jointe
    await this.sendEmailService.sendEmailFunction(
      user.email,
      'Nouvelle email créée', // Sujet de l'e-mail
      titre, 
      description, 
      attachmentData, // Contenu de la pièce jointe
      attachmentName, // Nom de la pièce jointe
      user.nom,
      user.prenom,
    );
  }
  

  async sendEmailWithoutAttachment(userId: string, titre: string, description: string) {
    const user = await this.findOne(+userId); // Récupérer l'utilisateur par son ID
  
    // Envoyer l'e-mail sans la pièce jointe
    await this.sendEmailService.sendEmailFunctionWithOutAttachment(
      user.email, 
      'Nouvelle email créée', // Sujet de l'e-mail
      titre, 
      description,
      user.nom,
      user.prenom
      
     
    );
  }
  


  
}
