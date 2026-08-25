import { ApplicationError } from '../../../../core/errors/application-error';

export class PermissionDeniedError extends ApplicationError {
  constructor(permission: string) {
    super({
      code: 'PERMISSION_DENIED',
      message: `Permission denied: ${permission}.`,
      statusCode: 403,
    });
  }
}
