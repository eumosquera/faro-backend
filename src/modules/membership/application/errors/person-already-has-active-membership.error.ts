import { ApplicationError } from '../../../../core/errors/application-error';

export class PersonAlreadyHasActiveMembershipError extends ApplicationError {
  constructor(personId: string, residentialComplexId: string) {
    super({
      code: 'PERSON_ALREADY_HAS_ACTIVE_MEMBERSHIP',
      message: `Person with id "${personId}" already has an active membership in residential complex "${residentialComplexId}"`,
      statusCode: 409,
    });
  }
}
