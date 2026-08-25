import { ApplicationError } from '../../../../core/errors/application-error';

export class AuthenticatedUserNotFoundError extends ApplicationError {
  constructor() {
    super({
      code: 'AUTHENTICATED_USER_NOT_FOUND',
      message: 'The authenticated user could not be resolved.',
      statusCode: 401,
    });
  }
}
