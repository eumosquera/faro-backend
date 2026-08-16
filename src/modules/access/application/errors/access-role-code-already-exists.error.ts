import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessRoleCodeAlreadyExistsError extends ApplicationError {
  constructor(code: string) {
    super({
      code: 'ACCESS_ROLE_CODE_ALREADY_EXISTS',
      message: `Access role with code "${code}" already exists`,
      statusCode: 409,
    });
  }
}
