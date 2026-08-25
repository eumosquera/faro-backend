import { Inject } from '@nestjs/common';

import type { AuthorizationContext } from '../authorization/authorization-context';
import type { AuthorizationContextRepository } from './../../domain/repositories/authorization-context.repository';
import { AuthorizationContextNotFoundError } from '../errors/authorization-context-not-found.error';
import { PermissionDeniedError } from '../errors/permission-denied.error';
import { AUTHORIZATION_CONTEXT_REPOSITORY } from '../../domain/repositories/authorization-context.repository.token';

export interface AuthorizeInput {
  personId: string;
  residentialComplexId: string;
  permission: string;
}

export class AuthorizationService {
  constructor(
    @Inject(AUTHORIZATION_CONTEXT_REPOSITORY)
    private readonly authorizationContextRepository: AuthorizationContextRepository,
  ) {}

  async authorize(input: AuthorizeInput): Promise<AuthorizationContext> {
    const context = await this.authorizationContextRepository.findContext(
      input.personId,
      input.residentialComplexId,
    );

    if (!context) {
      throw new AuthorizationContextNotFoundError();
    }

    if (!context.permissions.includes(input.permission)) {
      throw new PermissionDeniedError(input.permission);
    }

    return context;
  }
}
