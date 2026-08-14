import { ApplicationError } from '../../../../core/errors/application-error';

export class ActiveSubscriptionAlreadyExistsError extends ApplicationError {
  constructor(personId: string) {
    super({
      code: 'ACTIVE_SUBSCRIPTION_ALREADY_EXISTS',
      message: `Person with id "${personId}" already has an active subscription`,
      statusCode: 409,
    });
  }
}
