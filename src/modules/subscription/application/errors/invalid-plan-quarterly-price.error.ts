import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidPlanQuarterlyPriceError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_PLAN_QUARTERLY_PRICE',
      message: 'quarterlyPrice cannot be negative',
      statusCode: 400,
    });
  }
}
