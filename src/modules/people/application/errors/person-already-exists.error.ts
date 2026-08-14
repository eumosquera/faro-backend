import { ApplicationError } from '../../../../core/errors/application-error';

export class PersonAlreadyExistsError extends ApplicationError {
  constructor(identificationType: string, identificationNumber: string) {
    super({
      code: 'PERSON_ALREADY_EXISTS',
      message: `Person with identification ${identificationType}-${identificationNumber} already exists`,
      statusCode: 409,
    });
  }
}
