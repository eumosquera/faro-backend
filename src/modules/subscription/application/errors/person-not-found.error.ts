import { ApplicationError } from '../../../../core/errors/application-error';

export class PersonNotFoundError extends ApplicationError {
  constructor(personId: string) {
    super({
      code: 'PERSON_NOT_FOUND',
      message: `Person with id "${personId}" was not found`,
      statusCode: 404,
    });
  }
}
