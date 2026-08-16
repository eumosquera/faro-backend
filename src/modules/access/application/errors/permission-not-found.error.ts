import { ApplicationError } from '../../../../core/errors/application-error';

export class PermissionNotFoundError extends ApplicationError {
  constructor(permissionId: string) {
    super({
      code: 'PERMISSION_NOT_FOUND',
      message: `Permission with id "${permissionId}" was not found`,
      statusCode: 404,
    });
  }
}
