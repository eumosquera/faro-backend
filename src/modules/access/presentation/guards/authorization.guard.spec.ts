import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';

import type { AuthorizationService } from '../../application/authorization/authorization.service';

import type { AuthenticatedUser } from '../authenticated-user';
import { AuthorizationGuard } from './authorization.guard';

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;
  let reflector: jest.Mocked<Reflector>;
  let authorizationService: jest.Mocked<AuthorizationService>;

  let authorizeSpy: jest.SpiedFunction<AuthorizationService['authorize']>;

  const createExecutionContext = (request: {
    user?: AuthenticatedUser;
    params: Record<string, string | undefined>;
  }): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    authorizationService = {
      authorize: jest.fn(),
    } as unknown as jest.Mocked<AuthorizationService>;

    authorizeSpy = jest.spyOn(authorizationService, 'authorize');

    guard = new AuthorizationGuard(reflector, authorizationService);
  });

  it('should allow access when the route does not require a permission', async () => {
    reflector.get.mockReturnValue(undefined);

    const request = {
      params: {},
    };

    const context = createExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(authorizeSpy).not.toHaveBeenCalled();
  });

  it('should authorize the request when the required permission is granted', async () => {
    reflector.get.mockReturnValue('RESIDENT_UPDATE');

    authorizeSpy.mockResolvedValue({
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      membershipId: 'membership-1',
      roleId: 'role-1',
      permissions: ['RESIDENT_UPDATE'],
    });

    const request = {
      user: {
        personId: 'person-1',
      },
      params: {
        residentialComplexId: 'complex-1',
      },
    };

    const context = createExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    expect(authorizeSpy).toHaveBeenCalledTimes(1);
    expect(authorizeSpy).toHaveBeenCalledWith({
      personId: 'person-1',
      residentialComplexId: 'complex-1',
      permission: 'RESIDENT_UPDATE',
    });
  });

  it('should deny access when the authenticated user is missing', async () => {
    reflector.get.mockReturnValue('RESIDENT_UPDATE');

    const request = {
      params: {
        residentialComplexId: 'complex-1',
      },
    };

    const context = createExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(authorizeSpy).not.toHaveBeenCalled();
  });

  it('should deny access when residentialComplexId is missing', async () => {
    reflector.get.mockReturnValue('RESIDENT_UPDATE');

    const request = {
      user: {
        personId: 'person-1',
      },
      params: {},
    };

    const context = createExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(false);
    expect(authorizeSpy).not.toHaveBeenCalled();
  });

  it('should propagate authorization errors', async () => {
    reflector.get.mockReturnValue('RESIDENT_UPDATE');

    const authorizationError = new Error('Permission denied');

    authorizeSpy.mockRejectedValue(authorizationError);

    const request = {
      user: {
        personId: 'person-1',
      },
      params: {
        residentialComplexId: 'complex-1',
      },
    };

    const context = createExecutionContext(request);

    await expect(guard.canActivate(context)).rejects.toBe(authorizationError);

    expect(authorizeSpy).toHaveBeenCalledTimes(1);
  });
});
