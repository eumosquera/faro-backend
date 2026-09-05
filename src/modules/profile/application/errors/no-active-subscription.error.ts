import { ApplicationError } from '../../../../core/errors/application-error';

export class NoActiveSubscriptionError extends ApplicationError {
  constructor(personId: string) {
    super({
      code: 'NO_ACTIVE_SUBSCRIPTION',
      message: `La persona "${personId}" no tiene una suscripción vigente`,
      statusCode: 402,
    });
  }
}
