import { ApplicationError } from '../../../../core/errors/application-error';

export class MembershipNotFoundError extends ApplicationError {
  constructor() {
    super({
      code: 'MEMBERSHIP_NOT_FOUND',
      message: 'Membership not found.',
      statusCode: 404,
    });
  }
}
