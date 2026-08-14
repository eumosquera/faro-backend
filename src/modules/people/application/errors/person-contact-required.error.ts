import { ApplicationError } from '../../../../core/errors/application-error';

export class PersonContactRequiredError extends ApplicationError {
  constructor() {
    super({
      code: 'PERSON_CONTACT_REQUIRED',
      message: 'Person must have at least an email or a phone number',
      statusCode: 400,
    });
  }
}
