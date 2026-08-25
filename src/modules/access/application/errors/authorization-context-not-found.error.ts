import { ApplicationError } from '../../../../core/errors/application-error';

export class AuthorizationContextNotFoundError extends ApplicationError {
  constructor() {
    super({
      code: 'ACCESS_CONTEXT_NOT_FOUND',
      message: 'The authorization context could not be resolved.',
      statusCode: 403,
    });
  }
}
