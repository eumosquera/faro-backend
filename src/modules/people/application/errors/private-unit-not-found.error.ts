import { ApplicationError } from '../../../../core/errors/application-error';

export class PrivateUnitNotFoundError extends ApplicationError {
  constructor(privateUnitId: string) {
    super({
      code: 'PRIVATE_UNIT_NOT_FOUND',
      message: `Private unit with id "${privateUnitId}" not found`,
      statusCode: 404,
    });
  }
}
