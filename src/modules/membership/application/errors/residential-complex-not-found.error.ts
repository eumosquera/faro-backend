import { ApplicationError } from '../../../../core/errors/application-error';

export class ResidentialComplexNotFoundError extends ApplicationError {
  constructor(residentialComplexId: string) {
    super({
      code: 'RESIDENTIAL_COMPLEX_NOT_FOUND',
      message: `Residential complex with id "${residentialComplexId}" not found`,
      statusCode: 404,
    });
  }
}
