import { ApplicationError } from '../../../../core/errors/application-error';

export class RolePersonaNotFoundError extends ApplicationError {
  constructor(rolePersonaId: string) {
    super({
      code: 'ROLE_PERSONA_NOT_FOUND',
      message: `Role persona with id "${rolePersonaId}" not found`,
      statusCode: 404,
    });
  }
}
