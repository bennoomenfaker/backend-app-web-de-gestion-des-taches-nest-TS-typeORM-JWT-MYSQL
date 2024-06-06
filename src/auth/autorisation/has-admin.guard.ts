
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { hasAdmin } from './auth.util';

@Injectable()
export class HasAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!hasAdmin(user)) {
      throw new UnauthorizedException('Accès refusé. Vous devez être administrateur.');
    }
    return true;
  }
}
