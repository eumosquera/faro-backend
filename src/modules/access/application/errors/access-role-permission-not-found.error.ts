import { ApplicationError } from '../../../../core/errors/application-error';

export class AccessRolePermissionNotFoundError extends ApplicationError {
  constructor(accessRoleId: string, permissionId: string) {
    super({
      code: 'ACCESS_ROLE_PERMISSION_NOT_FOUND',
      message: `Permission "${permissionId}" is not assigned to access role "${accessRoleId}"`,
      statusCode: 404,
    });
  }
}
