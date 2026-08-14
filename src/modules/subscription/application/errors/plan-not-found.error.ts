import { ApplicationError } from '../../../../core/errors/application-error';

export class PlanNotFoundError extends ApplicationError {
  constructor(planId: string) {
    super({
      code: 'PLAN_NOT_FOUND',
      message: `Plan with id "${planId}" was not found`,
      statusCode: 404,
    });
  }
}
