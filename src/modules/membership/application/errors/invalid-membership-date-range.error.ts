import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidMembershipDateRangeError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_MEMBERSHIP_DATE_RANGE',
      message: 'Membership end date cannot be before start date',
      statusCode: 400,
    });
  }
}
