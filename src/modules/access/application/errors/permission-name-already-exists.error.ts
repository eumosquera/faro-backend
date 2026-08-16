import { ApplicationError } from '../../../../core/errors/application-error';

export class PermissionNameAlreadyExistsError extends ApplicationError {
  constructor(name: string) {
    super({
      code: 'PERMISSION_NAME_ALREADY_EXISTS',
      message: `Permission with name "${name}" already exists`,
      statusCode: 409,
    });
  }
}
