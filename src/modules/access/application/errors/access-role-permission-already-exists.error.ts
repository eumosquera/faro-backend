import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessRolePermissionAlreadyExistsError extends ApplicationError {
  constructor(accessRoleId: string, permissionId: string) {
    super({
      code: 'ACCESS_ROLE_PERMISSION_ALREADY_EXISTS',
      message: `Permission "${permissionId}" is already assigned to access role "${accessRoleId}"`,
      statusCode: 409,
    });
  }
}
