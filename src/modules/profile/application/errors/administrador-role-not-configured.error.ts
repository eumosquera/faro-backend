import { ApplicationError } from '../../../../core/errors/application-error';

export class AdministradorRoleNotConfiguredError extends ApplicationError {
  constructor() {
    super({
      code: 'ADMINISTRADOR_ROLE_NOT_CONFIGURED',
      message: 'No existe un AccessRole con código "ADMINISTRADOR".',
      statusCode: 500,
    });
  }
}
