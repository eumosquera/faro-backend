import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessRoleNotFoundError extends ApplicationError {
  constructor(accessRoleId: string) {
    super({
      code: 'ACCESS_ROLE_NOT_FOUND',
      message: `Access role with id "${accessRoleId}" not found`,
      statusCode: 404,
    });
  }
}
