import { ApplicationError } from '../../../../core/errors/application-error';

export class PlanCodeAlreadyExistsError extends ApplicationError {
  constructor(code: string) {
    super({
      code: 'PLAN_CODE_ALREADY_EXISTS',
      message: `Plan with code "${code}" already exists`,
      statusCode: 409,
    });
  }
}
