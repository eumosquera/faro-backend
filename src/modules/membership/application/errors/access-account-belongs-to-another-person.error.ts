import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessAccountBelongsToAnotherPersonError extends ApplicationError {
  constructor(accessAccountId: string, personId: string) {
    super({
      code: 'ACCESS_ACCOUNT_BELONGS_TO_ANOTHER_PERSON',
      message: `Access account with id "${accessAccountId}" does not belong to person "${personId}"`,
      statusCode: 409,
    });
  }
}
