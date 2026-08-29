import { ApplicationError } from '../../../../core/errors/application-error';

export class AdministradorRoleNotConfiguredError extends ApplicationError {
  constructor() {
    super({
      code: 'ADMINISTRADOR_ROLE_NOT_CONFIGURED',
      message:
        'No existe un AccessRole con código "ADMINISTRADOR". Debe crearse antes de habilitar el registro self-service.',
      statusCode: 500,
    });
  }
}
