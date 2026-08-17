import { ApplicationError } from '../../../../core/errors/application-error';

export class ExternalAuthIdentityAlreadyLinkedError extends ApplicationError {
  constructor(externalAuthId: string) {
    super({
      code: 'EXTERNAL_AUTH_IDENTITY_ALREADY_LINKED',
      message: `External authentication identity "${externalAuthId}" is already linked to an access account`,
      statusCode: 409,
    });
  }
}
