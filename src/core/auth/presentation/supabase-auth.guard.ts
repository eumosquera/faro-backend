import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import type { AuthenticatedIdentity } from '../domain/authenticated-identity';
import { SupabaseAuthService } from '../infrastructure/supabase-auth.service';

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedIdentity;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authentication required');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authentication header');
    }

    const identity = await this.supabaseAuthService.authenticate(token);

    request.user = identity;

    return true;
  }
}
