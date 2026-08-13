import { ApplicationError } from '../../../../core/errors/application-error';

export class ResidentialComplexNotFoundError extends ApplicationError {
  constructor(id: string) {
    super({
      code: 'RESIDENTIAL_COMPLEX_NOT_FOUND',
      message: `Residential complex with id "${id}" was not found`,
      statusCode: 404,
    });
  }
}
