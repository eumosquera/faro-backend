import { ApplicationError } from '../../../../core/errors/application-error';

export class PermissionCodeAlreadyExistsError extends ApplicationError {
  constructor(code: string) {
    super({
      code: 'PERMISSION_CODE_ALREADY_EXISTS',
      message: `Permission with code "${code}" already exists`,
      statusCode: 409,
    });
  }
}
