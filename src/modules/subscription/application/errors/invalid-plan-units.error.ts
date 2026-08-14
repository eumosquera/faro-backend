import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidPlanUnitsError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_PLAN_UNITS',
      message: 'maxUnits must be greater than zero',
      statusCode: 400,
    });
  }
}
