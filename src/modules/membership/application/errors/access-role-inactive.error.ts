import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessRoleInactiveError extends ApplicationError {
  constructor(accessRoleId: string) {
    super({
      code: 'ACCESS_ROLE_INACTIVE',
      message: `Access role with id "${accessRoleId}" is inactive`,
      statusCode: 409,
    });
  }
}
