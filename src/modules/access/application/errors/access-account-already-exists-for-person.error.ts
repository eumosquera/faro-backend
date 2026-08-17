import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessAccountAlreadyExistsForPersonError extends ApplicationError {
  constructor(personId: string) {
    super({
      code: 'ACCESS_ACCOUNT_ALREADY_EXISTS_FOR_PERSON',
      message: `Person with id "${personId}" already has an access account`,
      statusCode: 409,
    });
  }
}
