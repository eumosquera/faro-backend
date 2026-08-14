import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidPlanMonthlyPriceError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_PLAN_MONTHLY_PRICE',
      message: 'monthlyPrice cannot be negative',
      statusCode: 400,
    });
  }
}
