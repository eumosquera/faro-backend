import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';

import { AuthenticationContextService } from '../../application/authorization/authentication-context.service';
import type { ExternalAuthenticationService } from '../../domain/services/external-authentication.service';
import { EXTERNAL_AUTHENTICATION_SERVICE } from '../../domain/services/external-authentication.token';
import type { AuthenticatedUser } from '../authenticated-user';

interface AuthenticationRequest {
  headers: {
    authorization?: string;
  };
  user?: AuthenticatedUser;
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(EXTERNAL_AUTHENTICATION_SERVICE)
    private readonly externalAuthenticationService: ExternalAuthenticationService,
    private readonly authenticationContextService: AuthenticationContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticationRequest>();

    const authentication = await this.externalAuthenticationService.getAuthenticatedUser(
      request.headers.authorization,
    );

    const authenticatedUser = await this.authenticationContextService.resolve(
      authentication.externalAuthId,
    );

    request.user = authenticatedUser;

    return true;
  }
}
