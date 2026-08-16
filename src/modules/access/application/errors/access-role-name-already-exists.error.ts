import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessRoleNameAlreadyExistsError extends ApplicationError {
  constructor(name: string) {
    super({
      code: 'ACCESS_ROLE_NAME_ALREADY_EXISTS',
      message: `Access role with name "${name}" already exists`,
      statusCode: 409,
    });
  }
}
