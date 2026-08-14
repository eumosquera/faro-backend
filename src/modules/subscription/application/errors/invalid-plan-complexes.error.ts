import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidPlanComplexesError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_PLAN_COMPLEXES',
      message: 'maxComplexes must be greater than zero',
      statusCode: 400,
    });
  }
}
