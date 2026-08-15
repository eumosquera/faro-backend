import { ApplicationError } from '../../../../core/errors/application-error';

export class InvalidPersonUnitDateRangeError extends ApplicationError {
  constructor() {
    super({
      code: 'INVALID_PERSON_UNIT_DATE_RANGE',
      message: 'End date cannot be earlier than start date',
      statusCode: 400,
    });
  }
}
