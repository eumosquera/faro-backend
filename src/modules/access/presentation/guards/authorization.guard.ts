import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthorizationService } from '../../application/authorization/authorization.service';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';
import type { AuthenticatedUser } from '../authenticated-user';

interface AuthorizationRequest {
  user?: AuthenticatedUser;
  params: Record<string, string | undefined>;
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      REQUIRED_PERMISSION_KEY,
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthorizationRequest>();

    const personId = request.user?.personId;
    const residentialComplexId = request.params.residentialComplexId;

    if (!personId || !residentialComplexId) {
      return false;
    }

    await this.authorizationService.authorize({
      personId,
      residentialComplexId,
      permission: requiredPermission,
    });

    return true;
  }
}
