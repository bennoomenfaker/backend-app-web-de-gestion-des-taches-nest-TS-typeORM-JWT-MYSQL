
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {  hasUser } from './auth.util';

@Injectable()
export class HasUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!hasUser(user)) {
      throw new UnauthorizedException('Accès refusé. Vous devez être utilisateur.');
    }
    return true;
  }
}
