import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessAccountNotFoundError extends ApplicationError {
  constructor(accessAccountId: string) {
    super({
      code: 'ACCESS_ACCOUNT_NOT_FOUND',
      message: `Access account with id "${accessAccountId}" not found`,
      statusCode: 404,
    });
  }
}
