import { ApplicationError } from '../../../../core/errors/application-error';

export class RolePersonaNameAlreadyExistsError extends ApplicationError {
  constructor(name: string) {
    super({
      code: 'ROLE_PERSONA_NAME_ALREADY_EXISTS',
      message: `Role persona with name "${name}" already exists`,
      statusCode: 409,
    });
  }
}
