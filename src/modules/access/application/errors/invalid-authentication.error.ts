import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidAuthenticationError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_AUTHENTICATION',
      message: 'The authentication credentials are invalid.',
      statusCode: 401,
    });
  }
}
