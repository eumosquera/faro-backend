import { ApplicationError } from '../../../../core/errors/application-error';

export class PlanInactiveError extends ApplicationError {
  constructor(planId: string) {
    super({
      code: 'PLAN_INACTIVE',
      message: `Plan with id "${planId}" is inactive`,
      statusCode: 400,
    });
  }
}
