import type { AuthenticatedUserRepository } from '../../domain/repositories/authenticated-user.repository';
import { AuthenticatedUserNotFoundError } from '../errors/authenticated-user-not-found.error';
import { AuthenticationContextService } from './authentication-context.service';

describe('AuthenticationContextService', () => {
  let service: AuthenticationContextService;
  let authenticatedUserRepository: jest.Mocked<AuthenticatedUserRepository>;

  let findPersonIdSpy: jest.SpiedFunction<
    AuthenticatedUserRepository['findPersonIdByExternalAuthId']
  >;

  beforeEach(() => {
    authenticatedUserRepository = {
      findPersonIdByExternalAuthId: jest.fn(),
    };

    findPersonIdSpy = jest.spyOn(authenticatedUserRepository, 'findPersonIdByExternalAuthId');

    service = new AuthenticationContextService(authenticatedUserRepository);
  });

  it('should resolve the authenticated user', async () => {
    authenticatedUserRepository.findPersonIdByExternalAuthId.mockResolvedValue('person-1');

    const result = await service.resolve('external-auth-1');

    expect(result).toEqual({
      personId: 'person-1',
    });

    expect(findPersonIdSpy).toHaveBeenCalledTimes(1);
    expect(findPersonIdSpy).toHaveBeenCalledWith('external-auth-1');
  });

  it('should throw when the authenticated user cannot be resolved', async () => {
    authenticatedUserRepository.findPersonIdByExternalAuthId.mockResolvedValue(null);

    await expect(service.resolve('external-auth-1')).rejects.toBeInstanceOf(
      AuthenticatedUserNotFoundError,
    );

    expect(findPersonIdSpy).toHaveBeenCalledTimes(1);
    expect(findPersonIdSpy).toHaveBeenCalledWith('external-auth-1');
  });
});
