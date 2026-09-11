import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';

import type { ExternalAuthenticationService } from '../../domain/services/external-authentication.service';
import { EXTERNAL_AUTHENTICATION_SERVICE } from '../../domain/services/external-authentication.token';

export interface ExternallyAuthenticatedRequestUser {
  externalAuthId: string;
}

interface ExternalAuthenticationRequest {
  headers: {
    authorization?: string;
  };
  user?: ExternallyAuthenticatedRequestUser;
}

/**
 * A diferencia de AuthenticationGuard, este SOLO valida que el token de
 * Supabase sea válido — no exige que exista un AccessAccount/Person
 * resuelto. Úsalo únicamente en endpoints que necesitan distinguir "token
 * inválido" (401) de "token válido pero sin acceso a la aplicación" (una
 * respuesta normal en el body, ej. GetMyApplicationAccessUseCase).
 * Para todo lo demás, usa AuthenticationGuard.
 */
@Injectable()
export class ExternalAuthenticationGuard implements CanActivate {
  constructor(
    @Inject(EXTERNAL_AUTHENTICATION_SERVICE)
    private readonly externalAuthenticationService: ExternalAuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ExternalAuthenticationRequest>();

    const authentication = await this.externalAuthenticationService.getAuthenticatedUser(
      request.headers.authorization,
    );

    request.user = { externalAuthId: authentication.externalAuthId };

    return true;
  }
}
