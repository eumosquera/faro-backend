import type { ExecutionContext } from '@nestjs/common';

import type { AuthenticationContextService } from '../../application/authorization/authentication-context.service';
import type { ExternalAuthenticationService } from '../../domain/services/external-authentication.service';
import type { AuthenticatedUser } from '../authenticated-user';
import { AuthenticationGuard } from './authentication.guard';

interface TestRequest {
  headers: {
    authorization?: string;
  };
  user?: AuthenticatedUser;
}

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  let externalAuthenticationService: jest.Mocked<ExternalAuthenticationService>;

  let authenticationContextService: jest.Mocked<AuthenticationContextService>;

  let getAuthenticatedUserMock: jest.MockedFunction<
    ExternalAuthenticationService['getAuthenticatedUser']
  >;

  let resolveMock: jest.MockedFunction<AuthenticationContextService['resolve']>;

  const createExecutionContext = (request: TestRequest): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    const getAuthenticatedUser = jest.fn<
      ReturnType<ExternalAuthenticationService['getAuthenticatedUser']>,
      Parameters<ExternalAuthenticationService['getAuthenticatedUser']>
    >();

    externalAuthenticationService = {
      getAuthenticatedUser,
    };

    getAuthenticatedUserMock = getAuthenticatedUser;

    const resolve = jest.fn<
      ReturnType<AuthenticationContextService['resolve']>,
      Parameters<AuthenticationContextService['resolve']>
    >();

    authenticationContextService = {
      resolve,
    } as unknown as jest.Mocked<AuthenticationContextService>;

    resolveMock = resolve;

    guard = new AuthenticationGuard(externalAuthenticationService, authenticationContextService);
  });

  it('should resolve and attach the authenticated user', async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      externalAuthId: 'external-auth-1',
    });

    resolveMock.mockResolvedValue({
      personId: 'person-1',
    });

    const request: TestRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = createExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    expect(getAuthenticatedUserMock).toHaveBeenCalledTimes(1);
    expect(getAuthenticatedUserMock).toHaveBeenCalledWith('Bearer valid-token');

    expect(resolveMock).toHaveBeenCalledTimes(1);
    expect(resolveMock).toHaveBeenCalledWith('external-auth-1');

    expect(request.user).toEqual({
      personId: 'person-1',
    });
  });

  it('should propagate external authentication errors', async () => {
    const authenticationError = new Error('Invalid authentication');

    getAuthenticatedUserMock.mockRejectedValue(authenticationError);

    const request: TestRequest = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };

    const context = createExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toBe(authenticationError);

    expect(resolveMock).not.toHaveBeenCalled();
  });

  it('should propagate authentication context errors', async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      externalAuthId: 'external-auth-1',
    });

    const authenticationContextError = new Error('Authenticated user not found');

    resolveMock.mockRejectedValue(authenticationContextError);

    const request: TestRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = createExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toBe(authenticationContextError);
  });

  it('should pass the authorization header to the external authentication service', async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      externalAuthId: 'external-auth-1',
    });

    resolveMock.mockResolvedValue({
      personId: 'person-1',
    });

    const authorizationHeader = 'Bearer another-token';

    const request: TestRequest = {
      headers: {
        authorization: authorizationHeader,
      },
    };

    const context = createExecutionContext(request);

    await guard.canActivate(context);

    expect(getAuthenticatedUserMock).toHaveBeenCalledWith(authorizationHeader);
  });
});
