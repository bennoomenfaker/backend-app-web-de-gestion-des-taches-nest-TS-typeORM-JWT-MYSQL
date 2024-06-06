// auth.controller.ts

import { Body, Controller, Get, Post, UseGuards , Request, Param} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/auth.dto'; // Assurez-vous d'importer le DTO approprié
import { UserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './autorisation/auth.guard';
import { Payload } from '@nestjs/microservices';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.signin(signinDto);
    return { accessToken };
  }

  @Post('signup')
  async signup(@Body() userDto: UserDto): Promise<User> {
   const user =  await this.authService.signup(userDto);
   return user;
  }
  @UseGuards(AuthGuard )
  @Get('profile')
  getProfile(@Request() req) {
     return req.user;
  }




  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') newPassword: string
  ): Promise<{ success: boolean, message?: string }> {
    return await this.authService.resetPassword(token, newPassword);
  }
  @Post('forgot-password')
  async forgotPassword( @Body('email') email: string): Promise<void> {
    await this.authService.forgotPassword(email);
  }

  //forgot password mobile
  @Post('m.forgot-password')
  async forgotPasswordMobile( @Body('email') email: string): Promise<string> {
   const resetToken= await this.authService.forgotPasswordMobile(email);
    return resetToken;
    
  }


  

  



}
