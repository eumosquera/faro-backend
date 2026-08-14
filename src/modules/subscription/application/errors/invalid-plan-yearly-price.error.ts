import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidPlanYearlyPriceError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_PLAN_YEARLY_PRICE',
      message: 'yearlyPrice cannot be negative',
      statusCode: 400,
    });
  }
}
