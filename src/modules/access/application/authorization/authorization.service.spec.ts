import type { AuthorizationContext } from './authorization-context';
import type { AuthorizationContextRepository } from '../../domain/repositories/authorization-context.repository';
import { AuthorizationContextNotFoundError } from '../errors/authorization-context-not-found.error';
import { PermissionDeniedError } from '../errors/permission-denied.error';
import { AuthorizationService, type AuthorizeInput } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let authorizationContextRepository: jest.Mocked<AuthorizationContextRepository>;

  let findContextSpy: jest.SpiedFunction<AuthorizationContextRepository['findContext']>;

  beforeEach(() => {
    authorizationContextRepository = {
      findContext: jest.fn(),
    };

    findContextSpy = jest.spyOn(authorizationContextRepository, 'findContext');

    service = new AuthorizationService(authorizationContextRepository);
  });

  it('should authorize when the required permission is granted', async () => {
    const context: AuthorizationContext = {
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      membershipId: 'membership-1',
      roleId: 'role-1',
      permissions: ['RESIDENT_READ', 'RESIDENT_UPDATE'],
    };

    authorizationContextRepository.findContext.mockResolvedValue(context);

    const input: AuthorizeInput = {
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      permission: 'RESIDENT_UPDATE',
    };

    const result = await service.authorize(input);

    expect(result).toEqual(context);

    expect(findContextSpy).toHaveBeenCalledTimes(1);
    expect(findContextSpy).toHaveBeenCalledWith('person-1', 'complex-1');
  });

  it('should throw when the authorization context does not exist', async () => {
    authorizationContextRepository.findContext.mockResolvedValue(null);

    const input: AuthorizeInput = {
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      permission: 'RESIDENT_UPDATE',
    };

    await expect(service.authorize(input)).rejects.toBeInstanceOf(
      AuthorizationContextNotFoundError,
    );

    expect(findContextSpy).toHaveBeenCalledTimes(1);
    expect(findContextSpy).toHaveBeenCalledWith('person-1', 'complex-1');
  });

  it('should throw when the required permission is not granted', async () => {
    const context: AuthorizationContext = {
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      membershipId: 'membership-1',
      roleId: 'role-1',
      permissions: ['RESIDENT_READ'],
    };

    authorizationContextRepository.findContext.mockResolvedValue(context);

    const input: AuthorizeInput = {
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      permission: 'RESIDENT_UPDATE',
    };

    await expect(service.authorize(input)).rejects.toBeInstanceOf(PermissionDeniedError);

    expect(findContextSpy).toHaveBeenCalledTimes(1);
  });

  it('should not check permissions when the authorization context does not exist', async () => {
    authorizationContextRepository.findContext.mockResolvedValue(null);

    const input: AuthorizeInput = {
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      permission: 'RESIDENT_UPDATE',
    };

    await expect(service.authorize(input)).rejects.toBeInstanceOf(
      AuthorizationContextNotFoundError,
    );

    expect(findContextSpy).toHaveBeenCalledTimes(1);
  });
});
