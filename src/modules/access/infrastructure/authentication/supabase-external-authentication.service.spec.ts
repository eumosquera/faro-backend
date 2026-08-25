import { InvalidAuthenticationError } from '../../application/errors/invalid-authentication.error';
import type { SupabaseAuthClient } from './supabase-external-authentication.service';
import { SupabaseExternalAuthenticationService } from './supabase-external-authentication.service';

describe('SupabaseExternalAuthenticationService', () => {
  let service: SupabaseExternalAuthenticationService;
  let supabase: jest.Mocked<SupabaseAuthClient>;

  let getUserMock: jest.MockedFunction<SupabaseAuthClient['auth']['getUser']>;

  beforeEach(() => {
    const getUser = jest.fn<
      ReturnType<SupabaseAuthClient['auth']['getUser']>,
      Parameters<SupabaseAuthClient['auth']['getUser']>
    >();

    supabase = {
      auth: {
        getUser,
      },
    };

    getUserMock = getUser;

    service = new SupabaseExternalAuthenticationService(supabase);
  });

  it('should resolve the external auth id from a valid bearer token', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          id: 'supabase-user-1',
        },
      },
      error: null,
    });

    const result = await service.getAuthenticatedUser('Bearer valid-token');

    expect(result).toEqual({
      externalAuthId: 'supabase-user-1',
    });

    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(getUserMock).toHaveBeenCalledWith('valid-token');
  });

  it('should throw when the authorization header is missing', async () => {
    await expect(service.getAuthenticatedUser(undefined)).rejects.toBeInstanceOf(
      InvalidAuthenticationError,
    );

    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('should throw when the authorization scheme is not bearer', async () => {
    await expect(service.getAuthenticatedUser('Basic credentials')).rejects.toBeInstanceOf(
      InvalidAuthenticationError,
    );

    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('should throw when the bearer token is missing', async () => {
    await expect(service.getAuthenticatedUser('Bearer')).rejects.toBeInstanceOf(
      InvalidAuthenticationError,
    );

    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('should throw when Supabase returns an error', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: null,
      },
      error: new Error('Invalid token'),
    });

    await expect(service.getAuthenticatedUser('Bearer invalid-token')).rejects.toBeInstanceOf(
      InvalidAuthenticationError,
    );
  });

  it('should throw when Supabase does not return a user', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: null,
      },
      error: null,
    });

    await expect(service.getAuthenticatedUser('Bearer valid-token')).rejects.toBeInstanceOf(
      InvalidAuthenticationError,
    );
  });
});
