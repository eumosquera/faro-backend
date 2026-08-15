import { ApplicationError } from '../../../../core/errors/application-error';

export class RolePersonaCodeAlreadyExistsError extends ApplicationError {
  constructor(code: string) {
    super({
      code: 'ROLE_PERSONA_CODE_ALREADY_EXISTS',
      message: `Role persona with code "${code}" already exists`,
      statusCode: 409,
    });
  }
}
