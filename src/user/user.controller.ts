import { Controller, Get, Body, Param, Delete, UseGuards, Put, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/autorisation/auth.guard';
import { HasAdminGuard } from 'src/auth/autorisation/has-admin.guard';
import { HasAdminOrUserGuard } from 'src/auth/autorisation/has-admin-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';

/**lorsque j'utilise HasAdminGuard, 
 * qui est défini après AuthGuard, dans mon route avec @UseGuards, il hérite également de la même requête.
 *  */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @UseGuards(AuthGuard , HasAdminGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  
  @UseGuards(AuthGuard,HasAdminOrUserGuard)
  @Get(':id')
 findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard, HasAdminOrUserGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: UserDto) {
    const { nom, prenom, email, tel,password: newPassword } = userDto;
    return this.userService.update(+id, nom, prenom, email,tel, newPassword);
  }
  
  
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
  
  @UseGuards(AuthGuard,HasAdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return { message: 'User deleted successfully' };
  }


  @UseGuards(AuthGuard,HasAdminGuard)
  @Delete('/activate/:id')
  async activate(@Param('id') id: string) {
    await this.userService.activate(+id);
    return { message: 'User activated successfully' };
  }


@UseGuards(AuthGuard, HasAdminOrUserGuard)
@Post(':id/send-email')
@UseInterceptors(FileInterceptor('file'))
async sendEmailWithAttachment(
  @Param('id') userId: string,
  @Body() { titre, description }: { titre: string, description: string },
  @UploadedFile() file?: Express.Multer.File // Déclarer le fichier comme optionnel
) {
  let attachmentData;
  let attachmentName;

  if (file) {
    attachmentData = file.buffer; // Récupérer le contenu du fichier
    attachmentName = file.originalname; // Récupérer le nom du fichier
  }

  // Vérifier si le fichier est présent
  if (!file) {
    // Si aucun fichier n'est présent, appeler la méthode d'envoi d'email sans pièce jointe
    await this.userService.sendEmailWithoutAttachment(userId, titre, description);
  } else {
    // Si un fichier est présent, appeler la méthode d'envoi d'email avec pièce jointe
    await this.userService.sendEmailWithAttachment(userId, titre, description, attachmentData, attachmentName);
  }

  return { message: 'Email sent successfully' };
}







  
}










