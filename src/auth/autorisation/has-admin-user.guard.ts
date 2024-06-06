import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { hasAdmin, hasUser } from './auth.util';

@Injectable()
export class HasAdminOrUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!hasAdmin(user) && !hasUser(user)) {
      throw new UnauthorizedException('Accès refusé. Vous devez être administrateur ou utilisateur.');
    }
    return true;
  }
}
