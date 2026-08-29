import { ApplicationError } from '../../../../core/errors/application-error';

export class MembershipBelongsToAnotherResidentialComplex extends ApplicationError {
  constructor() {
    super({
      code: 'MEMBERSHIP_BELONGS_TO_ANOTHER_RESIDENTIAL_COMPLEX',
      message: 'Membership belongs to another residential complex',
      statusCode: 409,
    });
  }
}
