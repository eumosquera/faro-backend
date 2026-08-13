import { ApplicationError } from '../../../../core/errors/application-error';

export class PhysicalGroupNotFoundError extends ApplicationError {
  constructor(physicalGroupId: string) {
    super({
      code: 'PHYSICAL_GROUP_NOT_FOUND',
      message: `Physical group ${physicalGroupId} not found`,
      statusCode: 404,
    });
  }
}
