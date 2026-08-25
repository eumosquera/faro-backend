import { Inject } from '@nestjs/common';

import type { AuthenticatedUser } from '../../presentation/authenticated-user';
import type { AuthenticatedUserRepository } from '../../domain/repositories/authenticated-user.repository';
import { AuthenticatedUserNotFoundError } from '../errors/authenticated-user-not-found.error';
import { AUTHENTICATED_USER_REPOSITORY } from '../../domain/repositories/authenticated-user.repository.token';

export class AuthenticationContextService {
  constructor(
    @Inject(AUTHENTICATED_USER_REPOSITORY)
    private readonly authenticatedUserRepository: AuthenticatedUserRepository,
  ) {}

  async resolve(externalAuthId: string): Promise<AuthenticatedUser> {
    const personId =
      await this.authenticatedUserRepository.findPersonIdByExternalAuthId(externalAuthId);

    if (!personId) {
      throw new AuthenticatedUserNotFoundError();
    }

    return {
      personId,
    };
  }
}
