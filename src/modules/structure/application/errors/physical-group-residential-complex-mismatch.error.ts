import { ApplicationError } from '../../../../core/errors/application-error';

export class PhysicalGroupResidentialComplexMismatchError extends ApplicationError {
  constructor() {
    super({
      code: 'PHYSICAL_GROUP_RESIDENTIAL_COMPLEX_MISMATCH',
      message: 'Physical group does not belong to the residential complex',
      statusCode: 400,
    });
  }
}
