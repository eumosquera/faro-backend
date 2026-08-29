import { ApplicationError } from '../../../../core/errors/application-error';

export class PlanCodeNotFoundError extends ApplicationError {
  constructor(planCode: string) {
    super({
      code: 'PLAN_CODE_NOT_FOUND',
      message: `No existe un plan activo con el código "${planCode}"`,
      statusCode: 404,
    });
  }
}
