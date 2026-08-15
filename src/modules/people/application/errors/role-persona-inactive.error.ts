import { ApplicationError } from '../../../../core/errors/application-error';

export class RolePersonaInactiveError extends ApplicationError {
  constructor(rolePersonaId: string) {
    super({
      code: 'ROLE_PERSONA_INACTIVE',
      message: `Role persona with id "${rolePersonaId}" is inactive`,
      statusCode: 409,
    });
  }
}
