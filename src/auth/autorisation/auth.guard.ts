import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';


  //AuthGuard,  décrypte le token JWT et attache les informations de l'utilisateur à la requête via request.user
  import { JwtService } from '@nestjs/jwt';
  import { config } from '../config/constants';
  import { Request } from 'express';
  @Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
   if (!token) {
    return false;
  }
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: config.secret });

      // 💡 Assigner le payload à l'objet de requête ici pour y accéder dans nos gestionnaires de route
      request['user'] = payload;

      // Vérifiez si le token a expiré
      if (this.isTokenExpired(payload)) {
        throw new UnauthorizedException('Token expiré.');
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expiré.');
      } else {
        throw new UnauthorizedException('Token invalide.');
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isTokenExpired(payload: any): boolean {
    const expirationTime = payload.exp * 1000; // Convertir l'expiration du payload en millisecondes
    const currentTime = Date.now(); // Obtenir l'heure actuelle en millisecondes
    return currentTime > expirationTime; // Vérifiez si l'heure actuelle est supérieure à l'expiration
  }
}
