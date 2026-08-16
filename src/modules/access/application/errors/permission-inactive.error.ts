import { ApplicationError } from '../../../../core/errors/application-error';

export class PermissionInactiveError extends ApplicationError {
  constructor(permissionId: string) {
    super({
      code: 'PERMISSION_INACTIVE',
      message: `Permission with id "${permissionId}" is inactive`,
      statusCode: 400,
    });
  }
}
